#!/usr/bin/env python3
"""
Roaring OAuth2 Token Helper

Detta skript hjälper dig att få en access token från Roaring API.

Usage:
    1. Sätt ROARING_CLIENT_ID och ROARING_CLIENT_SECRET
    2. Kör: python3 get_roaring_token.py
    3. Kopiera access token och använd i test_data_updater.py
"""

import requests
import json
import sys
from datetime import datetime

# ============================================================================
# CONFIGURATION - Fyll i dina credentials från Roaring
# ============================================================================

CLIENT_ID = "your_client_id_here"
CLIENT_SECRET = "your_client_secret_here"

# OAuth2 Token Endpoint
TOKEN_URL = "https://api.roaring.io/oauth/token"

# ============================================================================
# MAIN
# ============================================================================

def get_access_token():
    """Get OAuth2 access token from Roaring"""
    
    print("\n" + "=" * 70)
    print("  ROARING OAUTH2 TOKEN HELPER")
    print("=" * 70)
    print(f"  Timestamp: {datetime.now().isoformat()}")
    print(f"  Token URL: {TOKEN_URL}")
    print("=" * 70 + "\n")
    
    # Check configuration
    if CLIENT_ID == "your_client_id_here":
        print("❌ ERROR: Please set CLIENT_ID in the script")
        print("\nYou need to:")
        print("1. Contact Roaring to get API credentials")
        print("2. Edit this file and set CLIENT_ID and CLIENT_SECRET")
        sys.exit(1)
    
    # Prepare request
    payload = {
        "grant_type": "client_credentials",
        "client_id": CLIENT_ID,
        "client_secret": CLIENT_SECRET,
        "scope": "company:read person:read"  # Adjust scope as needed
    }
    
    print("🔑 Requesting access token...")
    print(f"  Client ID: {CLIENT_ID[:10]}...")
    print(f"  Scope: {payload['scope']}\n")
    
    try:
        response = requests.post(
            TOKEN_URL,
            data=payload,
            headers={"Content-Type": "application/x-www-form-urlencoded"}
        )
        
        print(f"HTTP Status: {response.status_code}\n")
        
        if response.status_code == 200:
            data = response.json()
            
            access_token = data.get('access_token')
            token_type = data.get('token_type', 'Bearer')
            expires_in = data.get('expires_in', 'unknown')
            
            print("✅ SUCCESS! Access token received:\n")
            print("=" * 70)
            print(f"ACCESS_TOKEN=\"{access_token}\"")
            print("=" * 70)
            print(f"\nToken type: {token_type}")
            print(f"Expires in: {expires_in} seconds ({expires_in / 3600:.1f} hours)")
            
            print("\n📝 NEXT STEPS:")
            print("1. Copy the ACCESS_TOKEN above")
            print("2. Open test_data_updater.py")
            print("3. Replace 'your_access_token_here' with the token")
            print("4. Run: python3 test_data_updater.py")
            
            # Save to file for convenience
            with open('/tmp/roaring_token.txt', 'w') as f:
                f.write(access_token)
            
            print("\n💾 Token also saved to: /tmp/roaring_token.txt")
            
            return access_token
            
        else:
            print("❌ FAILED to get access token\n")
            print("Response:")
            print(json.dumps(response.json(), indent=2))
            
            print("\n🔍 TROUBLESHOOTING:")
            print("  - Check that CLIENT_ID and CLIENT_SECRET are correct")
            print("  - Verify that your credentials are activated in Roaring portal")
            print("  - Check if you need different scopes")
            print("  - Contact Roaring support if problem persists")
            
            return None
            
    except requests.exceptions.RequestException as e:
        print(f"❌ REQUEST ERROR: {e}")
        print("\n🔍 TROUBLESHOOTING:")
        print("  - Check your internet connection")
        print("  - Verify TOKEN_URL is correct")
        print("  - Check if Roaring API is down")
        return None
    
    except Exception as e:
        print(f"❌ UNEXPECTED ERROR: {e}")
        return None

if __name__ == "__main__":
    token = get_access_token()
    sys.exit(0 if token else 1)
