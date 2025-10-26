#!/usr/bin/env python3
"""
Test Roaring Beneficial Owners API
===================================
Tests beneficialOwnersSe2_1 service to get verkliga huvudmän (UBO)
"""

import sys
import json
from pathlib import Path

# Add project root to import roaring_credentials
sys.path.insert(0, str(Path(__file__).parent.parent.parent.parent))

try:
    from roaring_credentials import get_oauth2_credentials
    import requests
    
    CLIENT_ID, CLIENT_SECRET, TOKEN_URL = get_oauth2_credentials()
    print(f"✅ Credentials loaded from roaring.ini")
except ImportError as e:
    print(f"❌ Error: {e}")
    print("Make sure roaring_credentials.py is in project root")
    sys.exit(1)

# Configuration
BASE_URL = "https://api.roaring.io"

# Test companies
TEST_COMPANIES = [
    "5564881422",  # ICA Kvantum Huddinge (från tidigare tester)
    "5565274684",  # Roaring.io själva
    "5569002751",  # Fortnox AB
]

def get_access_token():
    """Get OAuth2 access token"""
    print(f"\n🔑 Getting access token from: {TOKEN_URL}")
    
    response = requests.post(
        TOKEN_URL,
        headers={"Content-Type": "application/x-www-form-urlencoded"},
        data={
            "grant_type": "client_credentials",
            "client_id": CLIENT_ID,
            "client_secret": CLIENT_SECRET
        }
    )
    
    if response.status_code == 200:
        token_data = response.json()
        print(f"✅ Token received! Expires in: {token_data.get('expires_in', 0)/60:.1f} minutes")
        return token_data['access_token']
    else:
        print(f"❌ Failed to get token: {response.status_code}")
        print(response.text)
        sys.exit(1)

def test_beneficial_owners(access_token, org_nr):
    """
    Test beneficial owners endpoints
    
    Two separate services:
    1. beneficialOwnersSe2_1 - Registered beneficial owners (>25%)
    2. Alternative Beneficial Owner 1.0 - Fallback (>5%, Chairman, CEO)
    
    Possible endpoint patterns based on Roaring API structure
    """
    
    print(f"\n{'='*70}")
    print(f"Testing Beneficial Owners for: {org_nr}")
    print(f"{'='*70}")
    
    # Try different possible endpoint patterns
    # Based on pattern from Data Updater: /se/company/current-information/X.X
    endpoints_to_try = [
        # Primary beneficial owners (registered, >25%)
        f"{BASE_URL}/se/company/beneficial-owners/2.1/{org_nr}",
        f"{BASE_URL}/se/beneficial-owners/2.1/{org_nr}",
        
        # Alternative beneficial owner (fallback, >5%)
        f"{BASE_URL}/se/company/alternative-beneficial-owner/1.0/{org_nr}",
        f"{BASE_URL}/se/alternative-beneficial-owner/1.0/{org_nr}",
        
        # Current information pattern (like Data Updater)
        f"{BASE_URL}/se/company/current-information/2.1/beneficial-owners/{org_nr}",
    ]
    
    headers = {
        "Authorization": f"Bearer {access_token}",
        "Accept": "application/json"
    }
    
    for endpoint in endpoints_to_try:
        print(f"\n🔍 Trying: {endpoint}")
        
        try:
            response = requests.get(endpoint, headers=headers, timeout=10)
            
            print(f"Status: {response.status_code}")
            
            if response.status_code == 200:
                print("✅ SUCCESS! Found working endpoint!")
                data = response.json()
                print(json.dumps(data, indent=2, ensure_ascii=False))
                return data
            elif response.status_code == 404:
                print("❌ 404 - Endpoint not found, trying next...")
            elif response.status_code == 401:
                print("❌ 401 - Unauthorized (token might be invalid)")
                return None
            else:
                print(f"❌ Error {response.status_code}")
                print(response.text[:500])
        except requests.exceptions.RequestException as e:
            print(f"❌ Request failed: {e}")
    
    print("\n⚠️  None of the tried endpoints worked")
    return None

def main():
    print("="*70)
    print("ROARING BENEFICIAL OWNERS API - TEST")
    print("="*70)
    
    # Get access token
    access_token = get_access_token()
    
    # Test each company
    for org_nr in TEST_COMPANIES:
        result = test_beneficial_owners(access_token, org_nr)
        if result:
            print(f"\n✅ Successfully retrieved beneficial owners for {org_nr}")
            break  # Found working endpoint, no need to test more companies
        print(f"\n⏭️  Moving to next company...\n")
    
    print("\n" + "="*70)
    print("TEST COMPLETE")
    print("="*70)
    print("\n💡 If all endpoints failed, we need to:")
    print("   1. Check Roaring API documentation for correct endpoint")
    print("   2. Contact Roaring support")
    print("   3. Check if beneficialOwnersSe2_1 requires special access")

if __name__ == "__main__":
    main()
