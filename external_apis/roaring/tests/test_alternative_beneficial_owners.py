#!/usr/bin/env python3
"""
Roaring.io Beneficial Owners API Test
======================================
Tests the Beneficial Owners endpoint to identify UBO (Verkliga Huvudmän).

CRITICAL for PML compliance (3 kap 6 § PML):
- Identifies individuals with >25% ownership or control
- Detects complex ownership structures (risk indicator)
- Mandatory for KYC/AML compliance

API Endpoint: GET /beneficial-owners/v1/se/{companyId}
Documentation: https://docs.roaring.io/

Usage:
    python3 test_beneficial_owners.py --company-id 5564866803
    python3 test_beneficial_owners.py --company-id 556903-8671 --verbose
"""

import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent.parent))

import argparse
import json
from credentials import get_oauth2_credentials
import requests


def test_beneficial_owners(company_id: str, verbose: bool = False):
    """
    Test Beneficial Owners API endpoint.
    
    Args:
        company_id: Swedish organization number (with or without hyphen)
        verbose: Print full JSON response
    """
    print(f"\n{'='*70}")
    print(f"👥 Roaring.io Beneficial Owners API Test")
    print(f"{'='*70}")
    print(f"Company ID: {company_id}")
    print(f"⚠️  CRITICAL: PML-krav 3 kap 6 § - Identifiera verklig huvudman")
    
    # Get OAuth2 credentials
    try:
        client_id, client_secret, token_url = get_oauth2_credentials()
        print(f"\n✅ Credentials loaded")
        print(f"   Token URL: {token_url}")
    except Exception as e:
        print(f"\n❌ Failed to load credentials: {e}")
        return
    
    # Step 1: Get access token
    print(f"\n{'='*70}")
    print(f"Step 1: Getting OAuth2 access token...")
    print(f"{'='*70}")
    
    try:
        response = requests.post(
            token_url,
            data={
                'grant_type': 'client_credentials',
                'client_id': client_id,
                'client_secret': client_secret
            },
            headers={'Content-Type': 'application/x-www-form-urlencoded'},
            timeout=10
        )
        
        if response.status_code == 200:
            token_data = response.json()
            access_token = token_data['access_token']
            expires_in = token_data.get('expires_in', 'unknown')
            print(f"✅ Authentication successful")
            print(f"   Token type: {token_data.get('token_type', 'Bearer')}")
            print(f"   Expires in: {expires_in} seconds")
        else:
            print(f"❌ Authentication failed")
            print(f"   Status: {response.status_code}")
            print(f"   Response: {response.text}")
            return
    except Exception as e:
        print(f"❌ Authentication error: {e}")
        return
    
    # Step 2: Query Beneficial Owners API
    print(f"\n{'='*70}")
    print(f"Step 2: Querying Beneficial Owners API...")
    print(f"{'='*70}")
    
    # Remove hyphen from company_id if present
    clean_company_id = company_id.replace('-', '')
    
    # NOTE: Using api.roaring.io as base (not sandbox-api)
    api_url = f"https://api.roaring.io/beneficial-owners/v1/se/{clean_company_id}"
    
    try:
        response = requests.get(
            api_url,
            headers={
                'Authorization': f'Bearer {access_token}',
                'Content-Type': 'application/json'
            },
            timeout=15
        )
        
        print(f"Request URL: {api_url}")
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            
            if verbose:
                print(f"\n{'='*70}")
                print(f"Full API Response:")
                print(f"{'='*70}")
                print(json.dumps(data, indent=2, ensure_ascii=False))
            
            # Parse and analyze beneficial owners
            print(f"\n{'='*70}")
            print(f"Beneficial Owners Analysis:")
            print(f"{'='*70}")
            
            owners = data.get('beneficialOwners', [])
            
            if not owners:
                print(f"⚠️  WARNING: No beneficial owners found!")
                print(f"   → PML-risk: Cannot identify ultimate beneficial owner")
                print(f"   → Action: Manual investigation required (3 kap 6 § PML)")
                print(f"   → Risk score: +10 points (unknown ownership)")
            else:
                print(f"✅ Found {len(owners)} beneficial owner(s)\n")
                
                total_risk_points = 0
                
                for idx, owner in enumerate(owners, 1):
                    print(f"Owner {idx}:")
                    print(f"  Name: {owner.get('name', 'N/A')}")
                    print(f"  Personal number: {owner.get('personalNumber', 'N/A')}")
                    print(f"  Ownership %: {owner.get('ownershipPercentage', 'N/A')}%")
                    print(f"  Control type: {owner.get('controlType', 'N/A')}")
                    print(f"  Ownership layers: {owner.get('ownershipLayers', 'N/A')}")
                    
                    # Risk analysis
                    risk_points = 0
                    risk_flags = []
                    
                    # Complex ownership structure
                    layers = owner.get('ownershipLayers', 0)
                    if layers > 2:
                        risk_points += 2
                        risk_flags.append(f"Complex structure (>2 layers): +2 points")
                    
                    # Foreign nationality
                    nationality = owner.get('nationality', 'SE')
                    if nationality != 'SE':
                        risk_flags.append(f"Foreign nationality ({nationality}): INFO only")
                    
                    # Low ownership percentage but control
                    ownership_pct = owner.get('ownershipPercentage', 100)
                    if ownership_pct < 50 and owner.get('controlType') in ['direct', 'indirect']:
                        risk_points += 1
                        risk_flags.append(f"Low ownership but control: +1 point")
                    
                    if risk_flags:
                        print(f"\n  ⚠️  Risk Indicators:")
                        for flag in risk_flags:
                            print(f"     - {flag}")
                    
                    total_risk_points += risk_points
                    print()
                
                print(f"{'='*70}")
                print(f"Total Risk Score: {total_risk_points} points")
                if total_risk_points == 0:
                    print(f"✅ Low risk - Simple ownership structure")
                elif total_risk_points <= 3:
                    print(f"⚠️  Medium risk - Some complexity detected")
                else:
                    print(f"🚨 High risk - Complex ownership structure, enhanced due diligence required")
            
            # Save response
            output_file = f"beneficial_owners_{clean_company_id}.json"
            with open(output_file, 'w', encoding='utf-8') as f:
                json.dump(data, f, indent=2, ensure_ascii=False)
            print(f"\n💾 Full response saved to: {output_file}")
            
        elif response.status_code == 404:
            print(f"⚠️  Company not found in Beneficial Owners registry")
            print(f"   This may indicate:")
            print(f"   - Company is too new")
            print(f"   - Company has no registered beneficial owners")
            print(f"   - Invalid organization number")
        else:
            print(f"❌ API request failed")
            print(f"   Status: {response.status_code}")
            print(f"   Response: {response.text}")
            
    except requests.exceptions.Timeout:
        print(f"❌ Request timeout - API took too long to respond")
    except requests.exceptions.ConnectionError as e:
        print(f"❌ Connection error: {e}")
    except Exception as e:
        print(f"❌ Unexpected error: {e}")


def main():
    parser = argparse.ArgumentParser(
        description='Test Roaring.io Beneficial Owners API',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
    python3 test_beneficial_owners.py --company-id 5564866803
    python3 test_beneficial_owners.py --company-id 556903-8671 --verbose
        """
    )
    parser.add_argument(
        '--company-id',
        required=True,
        help='Swedish organization number (with or without hyphen)'
    )
    parser.add_argument(
        '--verbose',
        action='store_true',
        help='Print full JSON response'
    )
    
    args = parser.parse_args()
    test_beneficial_owners(args.company_id, args.verbose)


if __name__ == '__main__':
    main()
