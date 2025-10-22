#-----Autentisering med client ID, client secret och valfri organisationslegitimation
# FIXAD VERSION - Använder certifikat även för API-anrop


import json
import requests
from requests_pkcs12 import Pkcs12Adapter
import uuid

# --- Dina uppgifter ---
OAUTH2_CLIENT_ID = "11a90b8849a912ea045b97597701cead83bd69f7b8a7df68"
OAUTH2_CLIENT_SECRET = "5d4b7894e65653d223d14ba12219e4361eb40ed528a7cead83bd69f7b8a7df68"
APIGW_CLIENT_ID = "ed6e1114-0e19-4103-b518-035ae5ef8eed"
APIGW_CLIENT_SECRET = "45e8647d-f61d-4a4b-ab2f-4781f2224435"
SCOPE = "skahmst"

# Certifikat
CERT_FILE_PATH = "68e28fae0d034.p12"
CERT_PASSWORD = "6323251803413456"

# Endpoints
TOKEN_URL = "https://sysorgoauth2.test.skatteverket.se/oauth2/v1/sysorg/token"
BASE_URL = "https://api.test.skatteverket.se"

# Global session med certifikat
cert_session = None

def init_cert_session():
    """Initierar en session med certifikat-autentisering"""
    global cert_session
    try:
        with open(CERT_FILE_PATH, 'rb') as f:
            cert_content = f.read()
        cert_session = requests.Session()
        cert_session.mount('https://', Pkcs12Adapter(
            pkcs12_data=cert_content, 
            pkcs12_password=CERT_PASSWORD
        ))
        print("✅ Certifikat-session initierad")
        return True
    except Exception as e:
        print(f"❌ Fel vid initiering av certifikat-session: {e}")
        return False

def get_access_token():
    """Hämtar access token via CCG med organisationslegitimation"""
    if not cert_session:
        print("❌ Certifikat-session ej initierad!")
        return None
        
    headers = {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
    }
    data = {
        "grant_type": "client_credentials",
        "client_id": OAUTH2_CLIENT_ID,
        "client_secret": OAUTH2_CLIENT_SECRET,
        "scope": SCOPE
    }

    print(f"\n📡 Hämtar access token...")
    print(f"   Endpoint: {TOKEN_URL}")
    print(f"   Scope: {SCOPE}")
    
    try:
        response = cert_session.post(TOKEN_URL, headers=headers, data=data)
        response.raise_for_status()

        token_data = response.json()
        print(f"\n✅ Token mottaget!")
        print(f"   Type: {token_data.get('token_type')}")
        print(f"   Expires in: {token_data.get('expires_in')} sekunder")
        print(f"   Scope: {token_data.get('scope')}")
        
        access_token = token_data.get("access_token")
        if not access_token:
            raise Exception("Ingen access_token i svaret")
        return access_token

    except requests.exceptions.RequestException as e:
        print(f"\n❌ Fel vid token-hämtning: {e}")
        if hasattr(e, 'response') and e.response is not None:
            print(f"   Status: {e.response.status_code}")
            print(f"   Response: {e.response.text}")
        return None
    except Exception as e:
        print(f"\n❌ Allmänt fel: {e}")
        return None

def call_bestall_api(access_token):
    """Anropar Skattekonto API 'beställ' endpoint"""
    if not access_token:
        print("\n❌ Ingen access_token tillgänglig!")
        return
    
    if not cert_session:
        print("\n❌ Certifikat-session ej initierad!")
        return

    api_url = f"{BASE_URL}/beskattning/skattekonto/huvudmans-saldo-och-transaktioner/v1/bestall"
    correlation_id = str(uuid.uuid4())[:36]  # Max 36 tecken

    headers = {
        "Authorization": f"Bearer {access_token}",
        "Client_Id": APIGW_CLIENT_ID,
        "Client_Secret": APIGW_CLIENT_SECRET,
        "skv_client_correlation_id": correlation_id,
        "Content-Type": "application/json",
        "Accept": "application/json"
    }

    data = {}  # Tom body för 'beställ'

    print(f"\n📡 Anropar Skattekonto API...")
    print(f"   Endpoint: {api_url}")
    print(f"   Correlation ID: {correlation_id}")

    try:
        # VIKTIGT: Använd cert_session istället för requests.post()!
        response = cert_session.post(api_url, headers=headers, json=data, timeout=10)
        
        print(f"\n📥 API Response:")
        print(f"   Status: {response.status_code}")
        print(f"   Headers: {dict(response.headers)}")
        print(f"   Body: {response.text}")

        if response.status_code == 202:
            print("\n✅ Anropet till 'beställ' lyckades (202 Accepted)!")
        elif response.status_code == 200:
            print("\n✅ Anropet lyckades (200 OK)!")
        else:
            print(f"\n⚠️ Oväntad status: {response.status_code}")

    except requests.exceptions.Timeout:
        print(f"\n⏱️ Timeout vid API-anrop (>10 sekunder)")
    except requests.exceptions.RequestException as e:
        print(f"\n❌ Fel vid API-anrop: {e}")
        if hasattr(e, 'response') and e.response is not None:
            print(f"   Status: {e.response.status_code}")
            print(f"   Response: {e.response.text}")
    except Exception as e:
        print(f"\n❌ Allmänt fel: {e}")

# --- Huvudprogram ---
if __name__ == "__main__":
    print("="*60)
    print("SKATTEVERKET API TEST - CCG med valfri org.legitimation")
    print("="*60)
    
    # 1. Initiera certifikat-session
    if not init_cert_session():
        print("\n❌ Kunde inte initiera certifikat-session. Avslutar.")
        exit(1)
    
    # 2. Hämta access token
    token = get_access_token()
    if not token:
        print("\n❌ Kunde inte hämta access token. Avslutar.")
        exit(1)
    
    # 3. Anropa API
    call_bestall_api(token)
    
    print("\n" + "="*60)
    print("TEST SLUTFÖRT")
    print("="*60)
