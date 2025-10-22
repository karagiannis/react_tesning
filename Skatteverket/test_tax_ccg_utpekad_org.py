import json
import uuid
import requests
from requests_pkcs12 import Pkcs12Adapter
import base64 # Lägg till denna import för att kunna skapa Basic Auth-header

# --- Dina uppgifter ---
# Från Skatteverkets registreringsfil
OAUTH2_CLIENT_ID = "11a90b8849a912ea045b97597701cead83bd69f7b8a7df68"
OAUTH2_CLIENT_SECRET = "5d4b7894e65653d223d14ba12219e4361eb40ed528a7cead83bd69f7b8a7df68" # Vi använder den här för Basic Auth
APIGW_CLIENT_ID = "ed6e1114-0e19-4103-b518-035ae5ef8eed"
APIGW_CLIENT_SECRET = "45e8647d-f61d-4a4b-ab2f-4781f2224435"
# Scope för ditt API
SCOPE = "skahmst"

# Från ditt PIN-kodsbrev och hämtade .p12-certifikat
CERT_FILE_PATH = "68e28fae0d034.p12" # Byt till namnet på din hämtade .p12-fil
CERT_PASSWORD = "6323251803413456" # PIN-kod från Bolag A.pdf

# --- Uppdaterad token-endpoint för CCG med organisationslegitimation ---
TOKEN_URL = "https://sysorgoauth2.test.skatteverket.se/oauth2/v1/sysorg/token"
# Testmiljöns bas-URL (fortfarande relevant för själva API-anropet)
BASE_URL = "https://api.test.skatteverket.se"

# --- 1. Hämta Access Token via CCG med "utpekad" organisationslegitimation ---
# I detta fall autentiseras client_id och client_secret via HTTP Basic Auth.
# Client_secret SKICKAS INTE med i POST-bodyn enligt testresultatet.
# Organisationscertifikatet används för TLS-autentisering.
def get_access_token():
    headers = {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
    }
    # OBS: client_secret INTE inkluderat i data!
    data = {
        "grant_type": "client_credentials", # CCG
        "client_id": OAUTH2_CLIENT_ID,
        "scope": SCOPE
    }

    # --- HTTP Basic Authentication ---
    # Skatteverket kan fortfarande kräva client_id och client_secret för Basic Auth,
    # även om de inte är i POST-bodyn för detta specifika flöde, baserat på testresultat.
    credentials = f"{OAUTH2_CLIENT_ID}:{OAUTH2_CLIENT_SECRET}"
    encoded_credentials = base64.b64encode(credentials.encode('utf-8')).decode('utf-8')
    headers["Authorization"] = f"Basic {encoded_credentials}"
    # --- SLUT HTTP Basic Authentication ---

    # Använd Pkcs12Adapter för att autentisera *hela anslutningen* till token-endpointen med .p12-certifikatet
    # Detta är hur "utpekad organisationslegitimation" autentiserar i detta flöde.
    print(f"Försöker hämta token från: {TOKEN_URL}")
    print(f"Skickar client_id och scope via POST-body.")
    print(f"Använder HTTP Basic Auth (client_id:client_secret) i header.")
    print(f"Använder organisationscertifikat för TLS-autentisering.")
    try:
        with open(CERT_FILE_PATH, 'rb') as f:
            cert_content = f.read()
        session = requests.Session()
        session.mount('https://', Pkcs12Adapter(pkcs12_data=cert_content, pkcs12_password=CERT_PASSWORD))

        response = session.post(TOKEN_URL, headers=headers, data=data)
        response.raise_for_status() # Kasta ett fel om statuskoden inte är 2xx

        token_data = response.json()
        print(f"Token Response: {json.dumps(token_data, indent=2)}")
        access_token = token_data.get("access_token")
        if not access_token:
            raise Exception("Ingen access_token hittades i svaret")
        return access_token

    except requests.exceptions.RequestException as e:
        print(f"Fel vid hämtning av token: {e}")
        if e.response is not None:
            print(f"Response status: {e.response.status_code}")
            print(f"Response text: {e.response.text}")
        return None
    except Exception as e:
        print(f"Allmänt fel vid hämtning av token: {e}")
        return None

# --- 2. Anropa API:et 'beställ' (samma som i test_tax.py) ---
def call_bestall_api(access_token):
    if not access_token:
        print("Ingen access_token tillgänglig. Kan inte anropa API:et.")
        return

    api_url = f"{BASE_URL}/beskattning/skattekonto/huvudmans-saldo-och-transaktioner/v1/bestall"
    correlation_id = str(uuid.uuid4())

    headers = {
        "Authorization": f"Bearer {access_token}",
        # --- Använd APIgw-nycklarna enligt dokumentation ---
        "Client_Id": APIGW_CLIENT_ID, # Observera versal I och d
        "Client_Secret": APIGW_CLIENT_SECRET, # Observera versal S och d
        # --- Korrelations-ID krävs ---
        "skv_client_correlation_id": correlation_id, # Ersätt med ett unikt värde per anrop i riktigt bruk
        # ---
        "Content-Type": "application/json" # eller hur API:et kräver (kan vara tom)
        # "Accept": "application/json" # Kan också vara relevant enligt dokumentationen (5.5 http-header)
    }

    # Body är tom för operationen 'beställ' enligt dokumentationen
    data = {} # eller None, beroende på exakt implementering

    try:
        response = requests.post(api_url, headers=headers, json=data) # eller data=data om text/plain
        print(f"API Response Status: {response.status_code}")
        print(f"API Response Text: {response.text}")

        if response.status_code == 202:
            print("Anropet till 'beställ' lyckades (202 Accepted).")
        else:
            print("Anropet till 'beställ' misslyckades.")

    except requests.exceptions.RequestException as e:
        print(f"Fel vid anrop till API:et: {e}")
        if e.response is not None:
            print(f"Response status: {e.response.status_code}")
            print(f"Response text: {e.response.text}")

# --- Huvudprogram ---
if __name__ == "__main__":
    print("Hämtar access token via CCG med *utpekad* organisationslegitimation...")
    print("(client_secret skickas INTE med i POST-data, utan i Basic Auth-header + TLS-certifikat)")
    token = get_access_token()

    print("\nAnropar 'beställ'-API...")
    call_bestall_api(token)

    print("\nTest slutfört.")