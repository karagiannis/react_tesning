# main.py
from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.responses import HTMLResponse
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime, timedelta
from datetime import timezone
import jwt
from jwt.exceptions import InvalidTokenError
from passlib.context import CryptContext
from typing import List, Optional, Dict, Any
import os
import csv
import logging
import secrets
import json
import shutil

# --- NYTT: Funktion för att skicka e-post via SendGrid Web API ---
import sendgrid
from sendgrid.helpers.mail import Mail, Email, To, Content
# Notera: Vi behöver inte längre smtplib, MIMEText, MIMEMultipart
# Vi behåller configparser och logging
import configparser



logging.basicConfig(filename='app.log', level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')




# === 1. Säkerhetsinställningar ===
SECRET_KEY = "Qwen-coder_STOP_ARGUING!"  # Byt ut mot en riktig hemlig nyckel
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30


# === 2. Filsystem och CSV-inställningar ===
DATA_DIR = "data"
USERS_FILE = os.path.join(DATA_DIR, "users.csv")
USERS_DATA_DIR = os.path.join(DATA_DIR, "users_data")
ASPIRING_USERS_FILE = os.path.join(DATA_DIR, "aspiring_users.csv")
ASPIRING_USERDATA_DIR = os.path.join(DATA_DIR, "aspiring_users_data")


# Skapa nödvändiga mappar och filer vid uppstart
os.makedirs(DATA_DIR, exist_ok=True)
os.makedirs(USERS_DATA_DIR, exist_ok=True)

# Initiera users.csv med rubriker om den inte finns
if not os.path.exists(USERS_FILE):
    with open(USERS_FILE, 'w', newline='') as f:
        writer = csv.writer(f)
        # Uppdatera rubriker: username (som e-post), hashed_password, is_confirmed, confirmation_token, confirmation_token_expires
        writer.writerow(["username", "hashed_password", "is_confirmed", "confirmation_token", "confirmation_token_expires"])
    logging.info(f"Skapade ny {USERS_FILE} med nya rubriker")



# ===  SendGrid-inställningar ===
config = configparser.ConfigParser()
config.read("sendgrid.ini")  # Ändra från "config.ini" till "sendgrid.ini"
SENDGRID_API_KEY = os.getenv("SENDGRID_API_KEY") or config.get('sendgrid', 'password', fallback=None)
FROM_EMAIL = os.getenv("FROM_EMAIL") or config.get('sendgrid', 'from_email', fallback=None)
FROM_NAME = os.getenv("FROM_NAME") or config.get('sendgrid', 'from_name', fallback=None)

# === 3. Säkerhetskomponenter ===
pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/login")

# === 4. Modeller ===
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: str | None = None

class User(BaseModel):
    username: str

class GameStateEntry(BaseModel):
    squares: List[Optional[str]]
    location: Optional[Dict[str, int]] | None

class GameStateResponse(BaseModel):
    history: List[GameStateEntry]
    currentMove: int

# === 5. Hjälpfunktioner för CSV ===
def get_user_from_csv(username: str, csv_file: str = USERS_FILE) -> Optional[Dict[str, str]]:
    """Läser en användare från angiven CSV-fil."""
    if not os.path.exists(csv_file):
        return None

    with open(csv_file, 'r', newline='') as f:
        reader = csv.DictReader(f)
        for row in reader:
            if row["username"] == username:
                return row
    return None


def create_user_in_csv(
    username: str,
    hashed_password: str,
    confirmation_token_hash: str,
    confirmation_token_expires: str,
    csv_file: str = USERS_FILE
):
    """Skapar en ny användare i angiven CSV-fil med obekräftad status och token."""
    with open(csv_file, 'a', newline='') as f:
        writer = csv.writer(f)
        writer.writerow([username, hashed_password, "False", confirmation_token_hash, confirmation_token_expires])
    logging.info(f"Lade till obekräftad användare {username} i {csv_file}")


def get_user_data_dir(username: str) -> str:
    """Returnerar sökvägen till en användares datamapp."""
    return os.path.join(USERS_DATA_DIR, username)

def ensure_user_data_dir(username: str):
    """Skapar användarens datamapp om den inte finns."""
    user_dir = get_user_data_dir(username)
    os.makedirs(user_dir, exist_ok=True)
    logging.info(f"Ensured data directory exists for user: {username}")

def get_games_file_path(username: str) -> str:
    """Returnerar sökvägen till en användares games.csv."""
    return os.path.join(get_user_data_dir(username), "games.csv")

def read_game_state_from_csv(username: str) -> Dict[str, Any]:
    """Läser det senaste spelets tillstånd från användarens games.csv."""
    games_file = get_games_file_path(username)
    if not os.path.exists(games_file):
        # Returnera standardtillstånd om ingen fil finns
        logging.info(f"Ingen games.csv hittades för {username}, returnerar standardtillstånd.")
        return {
            "history": [{"squares": [None] * 9, "location": None}],
            "currentMove": 0
        }

    with open(games_file, 'r', newline='') as f:
        reader = csv.DictReader(f)
        rows = list(reader)
        if not rows:
            # Returnera standardtillstånd om filen är tom
            logging.info(f"games.csv för {username} är tom, returnerar standardtillstånd.")
            return {
                "history": [{"squares": [None] * 9, "location": None}],
                "currentMove": 0
            }
        # Anta att den sista raden är det aktuella spelets tillstånd
        # Strukturen i CSV: game_id, history_json, current_move
        last_row = rows[-1]
        try:
            history = json.loads(last_row["history_json"])
            current_move = int(last_row["current_move"])
            return {"history": history, "currentMove": current_move}
        except (json.JSONDecodeError, ValueError, KeyError) as e:
            logging.error(f"Fel vid läsning av games.csv för {username}: {e}")
            # Returnera standardtillstånd vid fel
            return {
                "history": [{"squares": [None] * 9, "location": None}],
                "currentMove": 0
            }

def save_game_state_to_csv(username: str, game_state: Dict[str, Any]):
    """Sparar spelets tillstånd till användarens games.csv."""
    ensure_user_data_dir(username) # Skapa mapp om den inte finns
    games_file = get_games_file_path(username)

    # Initiera games.csv med rubriker om den inte finns
    file_exists = os.path.exists(games_file)
    with open(games_file, 'a', newline='') as f: # 'a' för att lägga till
        writer = csv.DictWriter(f, fieldnames=["game_id", "history_json", "current_move"])
        if not file_exists:
            writer.writeheader()
            logging.info(f"Skapade ny games.csv för användare: {username}")

        # För enkelhetens skull, skriv nuvarande tillstånd som en ny rad
        # I framtiden kan du vilja ha en bättre strategi, t.ex. en rad per spelomgång eller uppdatera samma rad.
        # Här sparar vi hela historiken och nuvarande drag som en JSON-sträng i en kolumn.
        
        game_data_to_write = {
            "game_id": "current_game", # Kan ändras till en unik ID per spelomgång
            "history_json": json.dumps(game_state["history"]),
            "current_move": game_state["currentMove"]
        }
        writer.writerow(game_data_to_write)
        logging.info(f"Sparade speldata för användare {username} till {games_file}")




# ---  Funktion för att skicka e-post via SendGrid Web API ---
def send_confirmation_email(to_email: str, username: str, confirmation_token: str):
    """
    Skickar ett e-postmeddelande med en bekräftelselänk via SendGrid Web API.
    """
    logging.info(f"Startar sändning av bekräftelsemail till {to_email} för användare {username}")
    logging.info(f"SENDGRID_API_KEY: {SENDGRID_API_KEY}")
    # --- Skapa e-postinnehåll (på svenska) ---
    confirmation_link = f"https://celestial.se/confirm?token={confirmation_token}"
    subject = "Bekräfta din e-postadress för Tre-i-rad"

    plain_text_content = f"""
    Hej,

    Tack för att du registrerade dig. Klicka på länken nedan för att bekräfta din e-postadress:

    {confirmation_link}

    Denna länk går ut efter 24 timmar.

    Vänliga hälsningar,
    {FROM_NAME}
    """

    html_content = f"""
    <html>
      <body>
        <p>Hej,</p>
        <p>Tack för att du registrerade dig. Klicka på länken nedan för att bekräfta din e-postadress:</p>
        <p><a href="{confirmation_link}">Bekräfta e-postadress</a></p>
        <p><em>Denna länk går ut efter 24 timmar.</em></p>
        <p>Vänliga hälsningar,<br>{FROM_NAME}</p>
      </body>
    </html>
    """
    # --- /Skapa e-postinnehåll ---

    # --- Konfigurera och skicka via SendGrid Web API ---
    try:
        logging.debug("Initierar SendGrid-klient...")
        sg = sendgrid.SendGridAPIClient(api_key=SENDGRID_API_KEY)
        
        # --- Tvinga EU-dataresidens ---
        logging.debug("Ställer in EU-dataresidens...")
        #sg.set_sendgrid_data_residency("eu")
        logging.debug("EU-dataresidens inställt.")
        # ---

        # --- Skapa mejlobjekt ---
        logging.debug("Skapar mejlobjekt...")
        from_email_obj = Email(FROM_EMAIL, FROM_NAME)
        to_email_obj = To(to_email)
        content_text = Content("text/plain", plain_text_content)
        content_html = Content("text/html", html_content)

        mail = Mail(from_email_obj, to_email_obj, subject, content_text)
        mail.add_content(content_html)
        logging.debug("Mejlobjekt skapat.")
        # ---

        # --- Skicka mejlet ---
        logging.info("Skickar mejlet via SendGrid Web API...")
        response = sg.client.mail.send.post(request_body=mail.get())
        # ---

        # --- Kontrollera svaret ---
        logging.debug(f"SendGrid svarade med statuskod: {response.status_code}")
        if response.status_code == 202:
            logging.info(f"E-post skickad till {to_email} för bekräftelse av {username} via SendGrid Web API")
            return True
        else:
            error_msg = f"Oväntad statuskod från SendGrid: {response.status_code}"
            logging.warning(error_msg)
            # Försök fånga eventuellt svarsmeddelande från SendGrid
            try:
                # response.body är bytes, så vi måste avkoda det först
                error_body_str = response.body.decode('utf-8')
                error_details = json.loads(error_body_str)
                logging.warning(f"Felinformation från SendGrid: {error_details}")
                error_msg += f" Detaljer: {error_details}"
            except Exception as parse_err:
                logging.error(f"Kunde inte tolka svarsbrödtexten från SendGrid: {parse_err}")
                logging.debug(f"Rå svarsbrödtext: {getattr(response, 'body', 'N/A')}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=error_msg
            )
        # ---

    except Exception as e:
        logging.error(f"Fel vid sändning av e-post till {to_email} via SendGrid Web API", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Registration failed due to email sending error: {str(e)}"
        )
    # --- /Konfigurera och skicka via SendGrid Web API ---





# === 6. Uppdaterade hjälpfunktioner ===
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_user(username: str):
    user_data = get_user_from_csv(username)
    if user_data:
        return User(username=user_data["username"])
    return None



def authenticate_user(username: str, password: str):
    user_data = get_user_from_csv(username)
    if not user_data:
        return False
    # Lägg till kontroll för is_confirmed
    if user_data.get("is_confirmed") != "True": # Jämför som sträng eftersom CSV sparar som sträng
        logging.info(f"Autentisering misslyckades för {username}: Konto inte bekräftat.")
        return False
    if not verify_password(password, user_data["hashed_password"]):
        return False
    return User(username=user_data["username"])





def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = TokenData(username=username)
    except InvalidTokenError:
        raise credentials_exception
    user = get_user(username=token_data.username)
    if user is None:
        raise credentials_exception
    return user

# === 7. Skapa FastAPI-appen ===
app = FastAPI(root_path="/tic-tac-toe-api")

# === 8. CORS ===
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://celestial.se",
                   "http://localhost:5173"],  # OBS: inga mellanslag!
    allow_methods=["*"],
    allow_headers=["*"],
)

# === 9. API Routes ===

# --- Inloggning ---
@app.post("/api/login", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    user = authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

# --- Skyddad route (för test) ---
@app.get("/api/users/me/", response_model=User)
async def read_users_me(current_user: User = Depends(get_current_user)):
    return current_user

# --- Spelet ---
@app.get("/api/game", response_model=GameStateResponse)
async def get_game(current_user: User = Depends(get_current_user)):
    game_state = read_game_state_from_csv(current_user.username)
    # Konvertera dict till Pydantic-modell
    return GameStateResponse(**game_state)


@app.post("/api/game")
async def save_game(game_data: GameStateResponse, current_user: User = Depends(get_current_user)):  # Skyddad
    # Konvertera Pydantic-modellerna till dictionaries innan sparning
    history_dicts = [entry.model_dump() for entry in game_data.history]
    game_state_dict = {
        "history": history_dicts,
        "currentMove": game_data.currentMove
    }
    # Spara spelets tillstånd till CSV för den inloggade användaren
    save_game_state_to_csv(current_user.username, game_state_dict)
    return {"status": "saved"}





@app.get("/health")
async def health():
    return {"status": "ok"}


# --- (Valfritt) Registrering ---
class UserCreate(BaseModel):
    username: str # Förväntar e-postadress här
    password: str
    # Du kan också ha en email: str här om du vill ha separat validering eller hantering,
    # men eftersom du sätter email som username är det enkelt att bara använda username.

@app.post("/api/register")
async def register(user_data: UserCreate):
    # Kontrollera både etablerade och aspirerande användare
    existing_user = get_user_from_csv(user_data.username, USERS_FILE)
    #aspiring_user = get_user_from_csv(user_data.username, ASPIRING_USERS_FILE)
    if existing_user: #or aspiring_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username (email) already registered"
        )

    confirmation_token = secrets.token_urlsafe(32)
    confirmation_token_hash = pwd_context.hash(confirmation_token)
    expires_delta = timedelta(hours=24)
    confirmation_token_expires = (datetime.utcnow() + expires_delta).isoformat()
    hashed_password = pwd_context.hash(user_data.password)

    # Skriv till aspiring_users.csv
    create_user_in_csv(
        user_data.username,
        hashed_password,
        confirmation_token_hash,
        confirmation_token_expires,
        ASPIRING_USERS_FILE
    )

    ensure_user_data_dir(user_data.username)
    initial_game_state = {
        "history": [{"squares": [None] * 9, "location": None}],
        "currentMove": 0
    }
    save_game_state_to_csv(user_data.username, initial_game_state)

    try:
        send_confirmation_email(user_data.username, user_data.username, confirmation_token)
    except HTTPException:
        raise

    logging.info(f"Aspirerande användare {user_data.username} registrerad och e-post skickad.")
    return {"msg": "User registered successfully. Please check your email to confirm your account."}


# --- Bekräftelse-endpoint ---
@app.get("/confirm")
async def confirm_email(token: str):
    logging.debug(f"Startar confirm-endpoint med token: {token}")
    user_data = None
    rows = []

    # 1. Kontrollera att aspiring_users.csv finns
    if not os.path.exists(ASPIRING_USERS_FILE):
        logging.error("Aspiring users CSV saknas!")
        raise HTTPException(status_code=500, detail="Aspiring user database not found.")

    # 2. Läs in alla rader från aspiring_users.csv
    with open(ASPIRING_USERS_FILE, 'r', newline='') as f:
        reader = csv.DictReader(f)
        for row in reader:
            rows.append(row)
            logging.debug(f"Kontrollerar rad: {row['username']} / token: {row['confirmation_token']}")
            # 3. Jämför token mot varje rad (hashad token i CSV)
            try:
                if pwd_context.verify(token, row["confirmation_token"]):
                    logging.info(f"Token matchar för användare: {row['username']}")
                    user_data = row  # Spara första matchande användare
            except Exception as e:
                logging.warning(f"Fel vid token-jämförelse: {e}")

    # 4. Om ingen rad matchar token, returnera fel
    if not user_data:
        logging.error("Ingen rad matchade token!")
        raise HTTPException(status_code=400, detail="Invalid confirmation token.")

    # 5. Kontrollera att token inte har gått ut
    token_expires_str = user_data["confirmation_token_expires"]
    logging.debug(f"Token expiry för användare {user_data['username']}: {token_expires_str}")
    try:
        token_expires = datetime.fromisoformat(token_expires_str)
    except ValueError:
        logging.error("Felaktigt datumformat på token expiry!")
        raise HTTPException(status_code=500, detail="Server error: Invalid token expiry date.")

    if datetime.now(timezone.utc) > token_expires.replace(tzinfo=timezone.utc):
        logging.info("Token har gått ut!")
        raise HTTPException(status_code=400, detail="Confirmation token has expired.")

    # 6. Skapa ny användare i users.csv med is_confirmed=True och tomma tokenfält
    logging.info(f"Flyttar användare {user_data['username']} till users.csv")
    create_user_in_csv(
        user_data["username"],
        user_data["hashed_password"],
        "",  # confirmation_token
        "",  # confirmation_token_expires
        USERS_FILE
    )

    # 7. Ta bort ALLA rader med samma username från aspiring_users.csv
    logging.info(f"Tar bort alla aspiranter med username: {user_data['username']}")
    temp_file_path = ASPIRING_USERS_FILE + ".tmp"
    with open(temp_file_path, 'w', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=rows[0].keys())
        writer.writeheader()
        for row in rows:
            if row["username"] != user_data["username"]:
                writer.writerow(row)
    shutil.move(temp_file_path, ASPIRING_USERS_FILE)

    logging.info(f"Användare {user_data['username']} har bekräftat sitt konto och flyttats till users.csv.")

    # 8. Returnera en HTML-sida som bekräftar att e-postadressen är verifierad
    success_html = """
    <html>
        <head><title>Email Confirmed</title></head>
        <body>
            <h1>Email Confirmed!</h1>
            <p>Your account has been successfully confirmed. You can now log in.</p>
        </body>
    </html>
    """
    logging.debug("Bekräftelsesida returneras.")
    return HTMLResponse(content=success_html, status_code=200)