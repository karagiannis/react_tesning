# Cloud Storage API:er - Jämförelse för Slide 27

**Datum:** 2025-10-20  
**Syfte:** Utvärdera Dropbox, Google Drive och OneDrive för automatisk dokumenthantering i onboarding-appen

---

## 🎯 Användningsfall

**Scenario:** Kund ska dela bokföringsunderlag (fakturor, kvitton, kontoutdrag, SIE-filer) med byrån.

**Krav:**
1. ✅ Kunden delar en mapp med byrån (read-only eller read-write)
2. ✅ Backend kan **rekursivt söka** igenom mappar och undermappar
3. ✅ Hitta specifika filtyper (PDF, SIE, JPG, PNG)
4. ✅ Filtrera på datum (t.ex. "senaste 12 månaderna")
5. ✅ Automatisk notifiering när nya filer läggs till (webhooks)
6. ✅ OAuth2-autentisering för säker användarauktorisering
7. ✅ Möjlighet att ladda ner filer för OCR/parsing

---

## 📊 API-jämförelse

| Feature | **Dropbox** | **Google Drive** | **OneDrive** |
|---------|-------------|------------------|--------------|
| **Rekursiv mapplistning** | ✅ `recursive=True` | ✅ Query-syntax | ✅ Manual recursion |
| **Filsökning (namn)** | ✅ | ✅ | ✅ |
| **Full-text search (innehåll)** | ❌ | ✅ Bäst! | ⚠️ Begränsad |
| **Delad mapp-åtkomst** | ✅ Enklast | ✅ | ✅ |
| **Webhooks** | ✅ Stabilt | ✅ Push notifications | ✅ Subscriptions |
| **Stora filer (chunked upload)** | ✅ 350 GB/fil | ✅ 5 TB/fil | ✅ 250 GB/fil |
| **API Rate limits** | 1000 req/app/min | 1000 req/user/100s | 10000 req/app/10min |
| **Python SDK kvalitet** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ (Graph API) |
| **Dokumentation** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **OAuth2 setup** | Enkel | Medium | Medium-Svår |
| **Kostnad (gratis tier)** | 2 GB | 15 GB | 5 GB |
| **Vanligt i branschen** | ✅ Mycket | ⚠️ Medium | ✅ Mycket (Microsoft 365) |

---

## 🔧 Teknisk implementation

### **1. Dropbox API** (REKOMMENDERAS FÖR MVP)

**Varför?**
- ✅ Enklast API att jobba med
- ✅ LIA-handledaren använder redan Dropbox
- ✅ Perfekt för bokföringsbyråer (branschstandard)
- ✅ Utmärkt Python SDK med bra dokumentation
- ✅ Stabila webhooks för realtidsnotifieringar

**Installation:**
```bash
pip install dropbox
```

**Exempel: Rekursiv filsökning**
```python
import dropbox
from datetime import datetime, timedelta

class DropboxHandler:
    def __init__(self, access_token):
        self.dbx = dropbox.Dropbox(access_token)
    
    def list_folder_recursive(self, path="/"):
        """
        Listar alla filer rekursivt i en mapp.
        Returns: List[FileMetadata]
        """
        try:
            result = self.dbx.files_list_folder(path, recursive=True)
            files = result.entries
            
            # Hantera pagination om det finns fler än 2000 filer
            while result.has_more:
                result = self.dbx.files_list_folder_continue(result.cursor)
                files.extend(result.entries)
            
            return [f for f in files if isinstance(f, dropbox.files.FileMetadata)]
        except dropbox.exceptions.ApiError as e:
            print(f"Dropbox API error: {e}")
            return []
    
    def find_files_by_extension(self, path="/", extensions=[".pdf", ".jpg", ".png"]):
        """
        Hitta alla filer med specifika filändelser.
        """
        all_files = self.list_folder_recursive(path)
        return [f for f in all_files 
                if any(f.name.lower().endswith(ext) for ext in extensions)]
    
    def find_recent_files(self, path="/", days=30):
        """
        Hitta filer modifierade senaste X dagarna.
        """
        cutoff_date = datetime.now() - timedelta(days=days)
        all_files = self.list_folder_recursive(path)
        return [f for f in all_files if f.server_modified > cutoff_date]
    
    def download_file(self, path, local_path):
        """
        Ladda ner en fil från Dropbox.
        """
        try:
            self.dbx.files_download_to_file(local_path, path)
            return True
        except dropbox.exceptions.ApiError as e:
            print(f"Download error: {e}")
            return False
    
    def setup_webhook(self, webhook_url):
        """
        Registrera webhook för ändringsnotifieringar.
        Dropbox skickar POST till webhook_url när filer ändras.
        """
        # Webhook-setup görs via Dropbox App Console
        # https://www.dropbox.com/developers/apps
        pass

# Användning
dbx = DropboxHandler(access_token="...")

# Hitta alla PDF-filer i kundens mapp
pdfs = dbx.find_files_by_extension("/Kunder/Acme AB/2024", [".pdf"])
print(f"Hittade {len(pdfs)} PDF-filer")

# Hitta filer från senaste 30 dagarna
recent = dbx.find_recent_files("/Kunder/Acme AB/2024", days=30)
print(f"Hittade {len(recent)} filer från senaste månaden")

# Ladda ner en specifik fil
dbx.download_file("/Kunder/Acme AB/2024/Faktura_123.pdf", "/tmp/faktura.pdf")
```

**OAuth2-flöde:**
```python
# 1. Skicka användare till Dropbox för auktorisering
auth_flow = dropbox.DropboxOAuth2FlowNoRedirect(
    consumer_key=CLIENT_ID,
    consumer_secret=CLIENT_SECRET,
    token_access_type='offline'  # För refresh tokens
)

authorize_url = auth_flow.start()
print(f"1. Gå till: {authorize_url}")
print("2. Klicka 'Allow' (kanske behöver logga in först)")
print("3. Kopiera auktoriseringskoden och klistra in här:")

auth_code = input("Kod: ").strip()

# 2. Byt ut auktoriseringskod mot access token
try:
    oauth_result = auth_flow.finish(auth_code)
    access_token = oauth_result.access_token
    refresh_token = oauth_result.refresh_token
    print(f"Access token: {access_token}")
    print(f"Refresh token: {refresh_token}")  # Spara detta säkert!
except Exception as e:
    print(f"Error: {e}")
```

**Webhook-implementation (Flask):**
```python
from flask import Flask, request
import hmac
import hashlib

app = Flask(__name__)

@app.route('/dropbox-webhook', methods=['GET', 'POST'])
def dropbox_webhook():
    if request.method == 'GET':
        # Dropbox verifierar webhook genom att skicka challenge
        challenge = request.args.get('challenge')
        return challenge, 200, {'Content-Type': 'text/plain'}
    
    elif request.method == 'POST':
        # Verifiera signatur
        signature = request.headers.get('X-Dropbox-Signature')
        if not verify_dropbox_signature(request.data, signature):
            return 'Invalid signature', 403
        
        # Hämta ändringar
        data = request.json
        for account in data.get('list_folder', {}).get('accounts', []):
            account_id = account
            # Hämta faktiska ändringar via files/list_folder/continue
            print(f"Ändringar för account: {account_id}")
        
        return '', 200

def verify_dropbox_signature(payload, signature):
    expected_signature = hmac.new(
        APP_SECRET.encode('utf-8'),
        payload,
        hashlib.sha256
    ).hexdigest()
    return hmac.compare_digest(signature, expected_signature)
```

---

### **2. Google Drive API**

**Varför?**
- ✅ **Full-text search i filinnehåll** (kan söka "Faktura 123" inuti PDF:er!)
- ✅ OCR-integration för skannade dokument
- ✅ Google Sheets API för bokföringsdata
- ⚠️ Mer komplex OAuth2-setup än Dropbox

**Installation:**
```bash
pip install google-api-python-client google-auth-httplib2 google-auth-oauthlib
```

**Exempel: Rekursiv sökning med kraftfull query-syntax**
```python
from googleapiclient.discovery import build
from google.oauth2.credentials import Credentials

class GoogleDriveHandler:
    def __init__(self, credentials):
        self.service = build('drive', 'v3', credentials=credentials)
    
    def search_files(self, folder_id=None, query=None, recursive=True):
        """
        Sök efter filer med Google's kraftfulla query-syntax.
        
        Exempel queries:
        - name contains 'faktura'
        - mimeType = 'application/pdf'
        - modifiedTime > '2024-01-01T00:00:00'
        - fullText contains 'Acme AB'  # Söker INUTI filer!
        """
        all_files = []
        page_token = None
        
        # Bygg query
        q_parts = []
        if folder_id:
            q_parts.append(f"'{folder_id}' in parents")
        if query:
            q_parts.append(query)
        q_parts.append("trashed = false")  # Exkludera borttagna filer
        
        q = " and ".join(q_parts)
        
        while True:
            results = self.service.files().list(
                q=q,
                spaces='drive',
                fields='nextPageToken, files(id, name, mimeType, parents, modifiedTime, size)',
                pageToken=page_token,
                pageSize=1000
            ).execute()
            
            files = results.get('files', [])
            all_files.extend(files)
            
            # Rekursivt söka i undermappar
            if recursive:
                for file in files:
                    if file.get('mimeType') == 'application/vnd.google-apps.folder':
                        subfolder_files = self.search_files(
                            folder_id=file['id'],
                            query=query,
                            recursive=True
                        )
                        all_files.extend(subfolder_files)
            
            page_token = results.get('nextPageToken')
            if not page_token:
                break
        
        return all_files
    
    def full_text_search(self, search_term, folder_id=None):
        """
        KRAFTFULL: Söker INUTI filinnehåll, inte bara filnamn!
        """
        query = f"fullText contains '{search_term}'"
        return self.search_files(folder_id=folder_id, query=query)
    
    def find_pdfs_by_date(self, folder_id, start_date):
        """
        Hitta PDF-filer modifierade efter ett visst datum.
        """
        query = f"mimeType = 'application/pdf' and modifiedTime > '{start_date}'"
        return self.search_files(folder_id=folder_id, query=query)
    
    def download_file(self, file_id, local_path):
        """
        Ladda ner en fil från Google Drive.
        """
        request = self.service.files().get_media(fileId=file_id)
        with open(local_path, 'wb') as f:
            downloader = MediaIoBaseDownload(f, request)
            done = False
            while not done:
                status, done = downloader.next_chunk()
                print(f"Download {int(status.progress() * 100)}%")

# Användning
drive = GoogleDriveHandler(credentials)

# Full-text search: Hitta alla filer som innehåller "Acme AB"
files = drive.full_text_search("Acme AB", folder_id="xyz123")

# Hitta PDF-filer från 2024
pdfs = drive.find_pdfs_by_date("xyz123", "2024-01-01T00:00:00")
```

**Fördelar:**
- 🔍 **Full-text search** - kan söka "organisationsnummer 556789-0123" och hitta alla dokument som nämner det!
- 📄 **OCR automatiskt** - Google läser text från skannade PDF:er
- 📊 **Google Sheets integration** - kan läsa bokföringsdata direkt från Sheets

---

### **3. Microsoft OneDrive/SharePoint API**

**Varför?**
- ✅ Perfekt för företag med Microsoft 365
- ✅ SharePoint-integration för större organisationer
- ⚠️ Mer komplex API än Dropbox

**Installation:**
```bash
pip install msal requests
```

**Exempel: Microsoft Graph API**
```python
import requests
import msal

class OneDriveHandler:
    def __init__(self, client_id, client_secret, tenant_id):
        self.client_id = client_id
        self.client_secret = client_secret
        self.tenant_id = tenant_id
        self.access_token = None
    
    def authenticate(self):
        """
        OAuth2-autentisering via Microsoft Identity Platform.
        """
        authority = f"https://login.microsoftonline.com/{self.tenant_id}"
        app = msal.ConfidentialClientApplication(
            self.client_id,
            authority=authority,
            client_credential=self.client_secret
        )
        
        result = app.acquire_token_for_client(
            scopes=["https://graph.microsoft.com/.default"]
        )
        
        if "access_token" in result:
            self.access_token = result["access_token"]
            return True
        else:
            print(f"Error: {result.get('error_description')}")
            return False
    
    def list_folder_recursive(self, folder_id=None, path=None):
        """
        Lista alla filer rekursivt i en mapp.
        """
        if not self.access_token:
            self.authenticate()
        
        headers = {'Authorization': f'Bearer {self.access_token}'}
        
        if folder_id:
            url = f'https://graph.microsoft.com/v1.0/me/drive/items/{folder_id}/children'
        elif path:
            url = f'https://graph.microsoft.com/v1.0/me/drive/root:/{path}:/children'
        else:
            url = 'https://graph.microsoft.com/v1.0/me/drive/root/children'
        
        all_items = []
        while url:
            response = requests.get(url, headers=headers).json()
            items = response.get('value', [])
            all_items.extend(items)
            
            # Rekursivt för undermappar
            for item in items:
                if 'folder' in item:
                    subfolder_items = self.list_folder_recursive(
                        folder_id=item['id']
                    )
                    all_items.extend(subfolder_items)
            
            url = response.get('@odata.nextLink')  # Pagination
        
        return all_items
    
    def search_files(self, query):
        """
        Sök efter filer med Microsoft Graph search.
        """
        if not self.access_token:
            self.authenticate()
        
        headers = {'Authorization': f'Bearer {self.access_token}'}
        url = f'https://graph.microsoft.com/v1.0/me/drive/search(q=\'{query}\')'
        
        response = requests.get(url, headers=headers).json()
        return response.get('value', [])

# Användning
onedrive = OneDriveHandler(CLIENT_ID, CLIENT_SECRET, TENANT_ID)
onedrive.authenticate()

# Lista alla filer i en mapp
files = onedrive.list_folder_recursive(path="Kunder/Acme AB")

# Sök efter PDF-filer
pdfs = onedrive.search_files("*.pdf")
```

---

## 🎯 Rekommendation

### **För MVP (v1.0): Dropbox endast**

**Varför:**
1. ✅ Enklast API att implementera
2. ✅ LIA-handledaren använder redan Dropbox
3. ✅ Perfekt för bokföringsbyråer
4. ✅ Stabila webhooks för realtidsnotifieringar
5. ✅ Bra Python SDK med utmärkt dokumentation

**Implementation: 1-2 dagars arbete**

---

### **För v2.0: Lägg till Google Drive + OneDrive**

**Varför:**
- 🔍 Google Drive: Full-text search + OCR (kraftfullast för dokumentsökning)
- 💼 OneDrive: Microsoft 365-integration (många företag har detta)

**Implementation: 2-3 dagars arbete för båda**

---

## 📋 Implementationsplan för Slide 27

### **React-komponent: `DocumentSetupSlide.jsx`**

```jsx
import React, { useState } from 'react';

const DocumentSetupSlide = () => {
  const [selectedProvider, setSelectedProvider] = useState('dropbox');
  const [authStatus, setAuthStatus] = useState('not_started');
  
  const handleDropboxAuth = async () => {
    setAuthStatus('authenticating');
    
    // OAuth2-flöde
    const authUrl = await fetch('/api/cloud/dropbox/auth-url').then(r => r.json());
    window.location.href = authUrl.url;
  };
  
  return (
    <div className="space-y-6">
      <h2>Steg 3: Digital dokumenthantering</h2>
      
      <div className="bg-blue-50 p-4 rounded">
        <p className="text-sm">
          För snabb och korrekt bokföring behöver vi få dina underlag digitalt.
          Välj din föredragna molnlagringstjänst nedan.
        </p>
      </div>
      
      {/* Provider Selection */}
      <div className="grid grid-cols-3 gap-4">
        <button
          onClick={() => setSelectedProvider('dropbox')}
          className={`p-4 border-2 rounded ${
            selectedProvider === 'dropbox' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
          }`}
        >
          <img src="/dropbox-logo.svg" alt="Dropbox" className="h-8 mx-auto mb-2" />
          <p className="text-sm font-semibold">Dropbox</p>
          <p className="text-xs text-gray-500">Rekommenderas</p>
        </button>
        
        <button
          onClick={() => setSelectedProvider('gdrive')}
          className={`p-4 border-2 rounded ${
            selectedProvider === 'gdrive' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
          }`}
        >
          <img src="/gdrive-logo.svg" alt="Google Drive" className="h-8 mx-auto mb-2" />
          <p className="text-sm font-semibold">Google Drive</p>
          <p className="text-xs text-gray-500">Full-text search</p>
        </button>
        
        <button
          onClick={() => setSelectedProvider('onedrive')}
          className={`p-4 border-2 rounded ${
            selectedProvider === 'onedrive' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
          }`}
        >
          <img src="/onedrive-logo.svg" alt="OneDrive" className="h-8 mx-auto mb-2" />
          <p className="text-sm font-semibold">OneDrive</p>
          <p className="text-xs text-gray-500">Microsoft 365</p>
        </button>
      </div>
      
      {/* Setup Instructions */}
      {selectedProvider === 'dropbox' && (
        <div className="bg-white border rounded p-4">
          <h3 className="font-semibold mb-2">Dropbox-setup</h3>
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>Klicka på "Anslut till Dropbox" nedan</li>
            <li>Logga in på Dropbox (om inte redan inloggad)</li>
            <li>Godkänn att appen får åtkomst till mappen <code className="bg-gray-100 px-1">/[Företagsnamn]_Underlag</code></li>
            <li>Du återvänder hit automatiskt när det är klart</li>
          </ol>
          
          <button
            onClick={handleDropboxAuth}
            className="mt-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            disabled={authStatus === 'authenticating'}
          >
            {authStatus === 'authenticating' ? 'Autentiserar...' : '🔗 Anslut till Dropbox'}
          </button>
        </div>
      )}
      
      {/* Similar sections for Google Drive and OneDrive */}
    </div>
  );
};

export default DocumentSetupSlide;
```

---

## 🔐 Säkerhet & GDPR

### **OAuth2 Scopes (minsta privilegier)**

**Dropbox:**
```
files.metadata.read  # Läsa filmetadata
files.content.read   # Läsa filinnehåll
```

**Google Drive:**
```
https://www.googleapis.com/auth/drive.readonly  # Read-only
# ELLER mer restriktivt:
https://www.googleapis.com/auth/drive.file  # Endast filer som appen skapat
```

**OneDrive:**
```
Files.Read.All  # Läsa alla filer
```

### **Token-lagring**

```python
# Kryptera tokens innan lagring i databas
from cryptography.fernet import Fernet

class TokenStorage:
    def __init__(self, encryption_key):
        self.cipher = Fernet(encryption_key)
    
    def encrypt_token(self, token):
        return self.cipher.encrypt(token.encode()).decode()
    
    def decrypt_token(self, encrypted_token):
        return self.cipher.decrypt(encrypted_token.encode()).decode()

# Spara i databas
db.execute("""
    INSERT INTO cloud_tokens (user_id, provider, encrypted_token, refresh_token)
    VALUES (?, ?, ?, ?)
""", (user_id, 'dropbox', encrypted_token, encrypted_refresh))
```

---

## 📈 Kostnad & Skalning

| Provider | Gratis tier | Betald (per användare) | Rate limits |
|----------|-------------|------------------------|-------------|
| **Dropbox** | 2 GB | $11.99/mån (2 TB) | 1000 req/app/min |
| **Google Drive** | 15 GB | $1.99/mån (100 GB) | 1000 req/user/100s |
| **OneDrive** | 5 GB | $1.99/mån (100 GB) | 10000 req/app/10min |

**För 100 kunder:**
- Dropbox Business: $15/user/mån = $1500/mån (overkill för read-only)
- **Bättre:** Använd användarnas egna Dropbox-konton via OAuth2 = $0/mån! 🎉

---

## ✅ Action Items

1. **Implementera Dropbox först** (1-2 dagar)
   - OAuth2-flöde
   - Rekursiv filsökning
   - Webhook för realtidsuppdateringar

2. **Skapa `DocumentSetupSlide.jsx`** (1 dag)
   - Provider selection (Dropbox/GDrive/OneDrive)
   - OAuth2-flöde per provider
   - Connection status indicator

3. **Backend endpoints** (1 dag)
   ```
   POST /api/cloud/dropbox/auth-url
   POST /api/cloud/dropbox/callback
   GET /api/cloud/dropbox/files?path=/Kunder/Acme
   POST /api/cloud/dropbox/webhook
   ```

4. **Testa med LIA-handledaren** (1 dag)
   - Använd riktig Dropbox-mapp
   - Verifiera att filer hittas korrekt
   - Testa webhook-notifieringar

**Total tid: ~4-5 dagar för komplett Dropbox-integration**

---

## 📚 Resurser

**Dropbox:**
- API Docs: https://www.dropbox.com/developers/documentation
- Python SDK: https://github.com/dropbox/dropbox-sdk-python
- OAuth Guide: https://developers.dropbox.com/oauth-guide

**Google Drive:**
- API Docs: https://developers.google.com/drive/api/v3/about-sdk
- Python Quickstart: https://developers.google.com/drive/api/quickstart/python
- Search Guide: https://developers.google.com/drive/api/v3/search-files

**OneDrive:**
- Graph API: https://learn.microsoft.com/en-us/onedrive/developer/
- Python SDK: https://github.com/microsoftgraph/msgraph-sdk-python
- Auth Guide: https://learn.microsoft.com/en-us/azure/active-directory/develop/v2-oauth2-auth-code-flow

---

**Slutsats:** Dropbox är det självklara valet för MVP, med Google Drive och OneDrive som tillägg i v2.0!
