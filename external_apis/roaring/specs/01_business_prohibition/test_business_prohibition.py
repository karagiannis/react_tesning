#!/usr/bin/env python3
"""
Roaring.io Business Prohibition API Test
=========================================
Tests the Business Prohibition endpoint to check for näringsförbud.

CRITICAL for compliance:
- Active näringsförbud = AUTOMATIC APPLICATION REJECTION
- Person cannot be director, signatory, or beneficial owner
- Check required for all key persons before onboarding

API Endpoints:
- GET /se/businessprohibition/1.0/person/{personalNumber}
- GET /se/businessprohibition/1.0/company/{companyId}

Usage:
    # Test person endpoint
    python3 test_business_prohibition.py --person 198503302393
    
    # Test company endpoint
    python3 test_business_prohibition.py --company 5565002465
    
    # Test company with custom history years
    python3 test_business_prohibition.py --company 5565002465 --history-years 5
    
    # Save result to file
    python3 test_business_prohibition.py --person 198503302393 --save
"""

import sys
from pathlib import Path

# Add parent directory to path to import credentials
spec_dir = Path(__file__).parent
roaring_root = spec_dir.parent.parent
sys.path.insert(0, str(roaring_root))

import argparse
import json
from datetime import datetime
from credentials import get_oauth2_credentials
import requests


def load_reference_data():
    """Load Swedish courts and decision codes for human-readable output."""
    courts = {}
    decision_codes = {}
    
    try:
        with open(spec_dir / 'SwedishCourts.json', 'r', encoding='utf-8') as f:
            courts_data = json.load(f)
            courts = courts_data.get('courts', {})
    except Exception as e:
        print(f"⚠️  Warning: Could not load SwedishCourts.json: {e}")
    
    try:
        with open(spec_dir / 'court_decision_codes.json', 'r', encoding='utf-8') as f:
            codes_data = json.load(f)
            decision_codes = codes_data.get('decisionTypes', {})
    except Exception as e:
        print(f"⚠️  Warning: Could not load court_decision_codes.json: {e}")
    
    return courts, decision_codes


def get_court_name(court_code, courts):
    """Get Swedish court name from code."""
    court_code_str = str(court_code)
    if court_code_str in courts:
        return courts[court_code_str].get('nameSv', f'Court code {court_code}')
    return f'Unknown court (code {court_code})'


def get_decision_type(decision_code, decision_codes):
    """Get decision type description from code."""
    if decision_code in decision_codes:
        return decision_codes[decision_code].get('nameSv', f'Code {decision_code}')
    return f'Unknown decision type ({decision_code})'


def test_person_endpoint(personal_number: str, save_result: bool = False):
    """
    Test Business Prohibition person endpoint.
    
    Args:
        personal_number: Swedish personal number
        save_result: Save result to JSON file
    """
    print(f"\n{'='*70}")
    print(f"🔍 Business Prohibition API - Person Endpoint Test")
    print(f"{'='*70}")
    print(f"Personal number: {personal_number}")
    print(f"Endpoint: GET /se/businessprohibition/1.0/person/{personal_number}")
    
    # Load reference data
    courts, decision_codes = load_reference_data()
    
    # Get OAuth2 credentials
    try:
        client_id, client_secret, token_url = get_oauth2_credentials()
        print(f"\n✅ Credentials loaded")
    except Exception as e:
        print(f"\n❌ Failed to load credentials: {e}")
        return None
    
    # Step 1: Authenticate
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
            print(f"✅ Authentication successful")
            print(f"   Token expires in: {token_data.get('expires_in', 'unknown')} seconds")
        else:
            print(f"❌ Authentication failed: {response.status_code}")
            print(f"   Response: {response.text}")
            return None
    except Exception as e:
        print(f"❌ Authentication error: {e}")
        return None
    
    # Step 2: Query Business Prohibition API
    print(f"\n{'='*70}")
    print(f"Step 2: Querying Business Prohibition API...")
    print(f"{'='*70}")
    
    # Remove hyphen if present
    clean_personal_number = personal_number.replace('-', '')
    
    api_url = f"https://api.roaring.io/se/businessprohibition/1.0/person/{clean_personal_number}"
    
    try:
        response = requests.get(
            api_url,
            headers={
                'Authorization': f'Bearer {access_token}',
                'Accept': 'application/json'
            },
            timeout=15
        )
        
        print(f"Request URL: {api_url}")
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            
            # Print full response
            print(f"\n{'='*70}")
            print(f"API Response:")
            print(f"{'='*70}")
            print(json.dumps(data, indent=2, ensure_ascii=False))
            
            # Parse and analyze
            print(f"\n{'='*70}")
            print(f"Analysis:")
            print(f"{'='*70}")
            
            records = data.get('records', [])
            status = data.get('status', {})
            
            print(f"Status: {status.get('text', 'Unknown')}")
            print(f"Records found: {len(records)}")
            
            if not records:
                print(f"\n✅ No business prohibition found")
                print(f"   → Person has clean record")
                print(f"   → Eligible for director/signatory roles")
            else:
                print(f"\n🚨 BUSINESS PROHIBITION DETECTED!")
                print(f"   → AUTOMATIC APPLICATION REJECTION")
                
                for idx, record in enumerate(records, 1):
                    print(f"\nProhibition {idx}:")
                    
                    # Person information
                    person_id = record.get('personId')
                    if person_id:
                        print(f"  Person ID: {person_id}")
                    
                    name_info = record.get('name', {})
                    if name_info:
                        full_name = name_info.get('fullName')
                        if full_name:
                            print(f"  Name: {full_name}")
                    
                    # Court information (try multiple field names)
                    court_code = record.get('courtCode') or record.get('swedishCourtCode')
                    if court_code:
                        court_name = get_court_name(court_code, courts)
                        print(f"  Court: {court_name} (code {court_code})")
                    
                    # Decision type
                    decision_type_code = record.get('decisionTypeCode') or record.get('decisionType')
                    if decision_type_code:
                        decision_desc = get_decision_type(decision_type_code, decision_codes)
                        print(f"  Decision type: {decision_desc} ({decision_type_code})")
                    
                    # Decision date
                    decision_date = record.get('decisionDate')
                    if decision_date:
                        print(f"  Decision date: {decision_date}")
                    
                    # Dates
                    valid_from = record.get('validFromDate') or record.get('startDate')
                    valid_to = record.get('validToDate') or record.get('endDate')
                    if valid_from:
                        print(f"  Valid from: {valid_from}")
                    if valid_to:
                        print(f"  Valid to: {valid_to}")
                    
                    # Temporary prohibition
                    temp_date = record.get('temporaryProhibitionDecisionDate')
                    if temp_date:
                        print(f"  Temporary prohibition date: {temp_date}")
                    
                    # Address information
                    address_info = record.get('addressInformation', {})
                    if address_info:
                        address = address_info.get('address')
                        city = address_info.get('city')
                        zip_code = address_info.get('zipCode')
                        if address or city:
                            print(f"  Address: {address}, {zip_code} {city}")
                    
                    # Additional info
                    reason = record.get('reason')
                    if reason:
                        print(f"  Reason: {reason}")
                    
                    data_sourcing = record.get('dataSourcing', {})
                    case_number = data_sourcing.get('caseNumber') or record.get('caseNumber')
                    if case_number:
                        print(f"  Case number: {case_number}")
                    
                    # Exemptions
                    exemptions = record.get('exemptions', [])
                    if exemptions:
                        print(f"  Exemptions: {len(exemptions)}")
                        for exemption in exemptions:
                            print(f"    - {exemption}")
                    
                    # Free text
                    free_text = record.get('freeText')
                    if free_text:
                        print(f"  Additional notes: {free_text}")
            
            # Save to file if requested
            if save_result:
                timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
                output_file = spec_dir / f"result_person_{clean_personal_number}_{timestamp}.json"
                with open(output_file, 'w', encoding='utf-8') as f:
                    json.dump(data, f, indent=2, ensure_ascii=False)
                print(f"\n💾 Result saved to: {output_file.name}")
            
            return data
            
        elif response.status_code == 404:
            print(f"⚠️  Person not found in registry")
            print(f"   → This typically means no prohibition exists")
            return None
        else:
            print(f"❌ API request failed")
            print(f"   Status: {response.status_code}")
            print(f"   Response: {response.text}")
            return None
            
    except Exception as e:
        print(f"❌ Error: {e}")
        return None


def test_company_endpoint(company_id: str, history_years: int = 2, save_result: bool = False):
    """
    Test Business Prohibition company endpoint.
    
    Args:
        company_id: Swedish organization number
        history_years: How many years back to check (0-5)
        save_result: Save result to JSON file
    """
    print(f"\n{'='*70}")
    print(f"🏢 Business Prohibition API - Company Endpoint Test")
    print(f"{'='*70}")
    print(f"Company ID: {company_id}")
    print(f"History years: {history_years}")
    print(f"Endpoint: GET /se/businessprohibition/1.0/company/{company_id}")
    
    # Load reference data
    courts, decision_codes = load_reference_data()
    
    # Get OAuth2 credentials
    try:
        client_id, client_secret, token_url = get_oauth2_credentials()
        print(f"\n✅ Credentials loaded")
    except Exception as e:
        print(f"\n❌ Failed to load credentials: {e}")
        return None
    
    # Step 1: Authenticate
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
            print(f"✅ Authentication successful")
        else:
            print(f"❌ Authentication failed: {response.status_code}")
            return None
    except Exception as e:
        print(f"❌ Authentication error: {e}")
        return None
    
    # Step 2: Query Business Prohibition API
    print(f"\n{'='*70}")
    print(f"Step 2: Querying Business Prohibition API...")
    print(f"{'='*70}")
    
    # Remove hyphen if present
    clean_company_id = company_id.replace('-', '')
    
    api_url = f"https://api.roaring.io/se/businessprohibition/1.0/company/{clean_company_id}"
    params = {'relationsHistoryYears': history_years}
    
    try:
        response = requests.get(
            api_url,
            headers={
                'Authorization': f'Bearer {access_token}',
                'Accept': 'application/json'
            },
            params=params,
            timeout=15
        )
        
        print(f"Request URL: {api_url}")
        print(f"Parameters: {params}")
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            
            # Print full response
            print(f"\n{'='*70}")
            print(f"API Response:")
            print(f"{'='*70}")
            print(json.dumps(data, indent=2, ensure_ascii=False))
            
            # Parse and analyze
            print(f"\n{'='*70}")
            print(f"Analysis:")
            print(f"{'='*70}")
            
            records = data.get('records', [])
            status = data.get('status', {})
            
            print(f"Status: {status.get('text', 'Unknown')}")
            print(f"Representatives with prohibition: {len(records)}")
            
            if not records:
                print(f"\n✅ No business prohibitions found among representatives")
                print(f"   → Company has clean record")
                print(f"   → Safe to proceed with onboarding")
            else:
                print(f"\n🚨 BUSINESS PROHIBITION DETECTED IN REPRESENTATIVES!")
                print(f"   → AUTOMATIC APPLICATION REJECTION")
                print(f"   → Company has {len(records)} representative(s) with prohibition")
                
                for idx, record in enumerate(records, 1):
                    print(f"\nRepresentative {idx}:")
                    
                    personal_number = record.get('personalNumber')
                    if personal_number:
                        print(f"  Personal number: {personal_number}")
                    
                    role = record.get('role')
                    if role:
                        print(f"  Role: {role}")
                    
                    # Show prohibition details if available
                    prohibition = record.get('prohibition', {})
                    if prohibition:
                        start_date = prohibition.get('startDate')
                        end_date = prohibition.get('endDate')
                        if start_date:
                            print(f"  Prohibition start: {start_date}")
                        if end_date:
                            print(f"  Prohibition end: {end_date}")
            
            # Save to file if requested
            if save_result:
                timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
                output_file = spec_dir / f"result_company_{clean_company_id}_{timestamp}.json"
                with open(output_file, 'w', encoding='utf-8') as f:
                    json.dump(data, f, indent=2, ensure_ascii=False)
                print(f"\n💾 Result saved to: {output_file.name}")
            
            return data
            
        elif response.status_code == 404:
            print(f"⚠️  Company not found")
            return None
        else:
            print(f"❌ API request failed")
            print(f"   Status: {response.status_code}")
            print(f"   Response: {response.text}")
            return None
            
    except Exception as e:
        print(f"❌ Error: {e}")
        return None


def main():
    parser = argparse.ArgumentParser(
        description='Test Roaring.io Business Prohibition API',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
    # Test person endpoint
    python3 test_business_prohibition.py --person 198503302393
    
    # Test company endpoint
    python3 test_business_prohibition.py --company 5565002465
    
    # Test company with 5 years history
    python3 test_business_prohibition.py --company 5565002465 --history-years 5
    
    # Save result to file
    python3 test_business_prohibition.py --person 198503302393 --save

Sandbox test data available in sandbox_examples.json
        """
    )
    
    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument(
        '--person',
        metavar='PERSONAL_NUMBER',
        help='Test person endpoint with Swedish personal number'
    )
    group.add_argument(
        '--company',
        metavar='COMPANY_ID',
        help='Test company endpoint with Swedish organization number'
    )
    
    parser.add_argument(
        '--history-years',
        type=int,
        default=2,
        choices=range(0, 6),
        help='Years back to check for company endpoint (0-5, default: 2)'
    )
    
    parser.add_argument(
        '--save',
        action='store_true',
        help='Save result to JSON file'
    )
    
    args = parser.parse_args()
    
    if args.person:
        test_person_endpoint(args.person, args.save)
    elif args.company:
        test_company_endpoint(args.company, args.history_years, args.save)


if __name__ == '__main__':
    main()
