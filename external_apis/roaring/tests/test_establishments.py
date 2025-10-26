#!/usr/bin/env python3
"""
Roaring.io Establishments API v2.0 Test Script

Tests the Establishments API for fetching company workplaces (Local Units):
- Company establishment number (CFAR)
- Office name and type
- Postal and visit addresses
- Contact information (phone, fax, email)
- Industry codes (SNI/NACE)
- Number of employees

Author: Celestial AB
Date: 2025-10-25
API Docs: https://api.roaring.io/se/company/establishment/2.0
"""

import requests
import json
import sys
import argparse
from typing import Optional, Dict, Any, List
from pathlib import Path

# Add parent directory to path to import credentials
sys.path.insert(0, str(Path(__file__).parent.parent))
from credentials import get_oauth2_credentials


class RoaringEstablishmentsTester:
    """Test harness for Roaring.io Establishments API v2.0"""
    
    def __init__(self):
        self.base_url = "https://api.roaring.io/se/company/establishment/2.0"
        self.token_url = "https://api.roaring.io/token"
        self.access_token = None
        
    def authenticate(self) -> bool:
        """Authenticate using OAuth2 Client Credentials flow"""
        try:
            client_id, client_secret, token_url = get_oauth2_credentials()
            
            response = requests.post(
                token_url,
                data={
                    'grant_type': 'client_credentials',
                    'client_id': client_id,
                    'client_secret': client_secret
                },
                headers={'Content-Type': 'application/x-www-form-urlencoded'}
            )
            
            if response.status_code == 200:
                token_data = response.json()
                self.access_token = token_data.get('access_token')
                expires_in = token_data.get('expires_in', 'unknown')
                print(f"✅ Authentication successful (token expires in {expires_in}s)")
                return True
            else:
                print(f"❌ Authentication failed: {response.status_code}")
                print(response.text)
                return False
                
        except Exception as e:
            print(f"❌ Authentication error: {e}")
            return False
    
    def _get_headers(self) -> Dict[str, str]:
        """Get headers with authentication token"""
        return {
            'Authorization': f'Bearer {self.access_token}',
            'Accept': 'application/json'
        }
    
    def get_establishments(self, company_id: str) -> Optional[Dict[str, Any]]:
        """
        Get all establishments (workplaces) for a company
        
        Args:
            company_id: Swedish organization number (e.g., "5564866803")
        
        Returns:
            EstablishmentsResult with establishments[] and status
        """
        url = f"{self.base_url}/{company_id}"
        
        try:
            response = requests.get(url, headers=self._get_headers())
            
            if response.status_code == 200:
                return response.json()
            elif response.status_code == 404:
                print(f"❌ Company {company_id} not found")
                return None
            else:
                print(f"❌ Request failed: {response.status_code}")
                print(response.text)
                return None
                
        except Exception as e:
            print(f"❌ Error fetching establishments: {e}")
            return None
    
    def print_result(self, result: Dict[str, Any], verbose: bool = False):
        """Pretty print establishments result"""
        if not result:
            return
        
        status = result.get('status', {})
        company_id = result.get('companyId')
        change_date = result.get('changeDate')
        establishments = result.get('establishments', [])
        
        print(f"\n{'='*80}")
        print(f"Company: {company_id}")
        print(f"Status: Code {status.get('code')} - {status.get('text')}")
        print(f"Change Date: {change_date}")
        print(f"Establishments: {len(establishments)}")
        print(f"{'='*80}")
        
        for idx, est in enumerate(establishments, 1):
            cfar = est.get('companyEstablishmentNumber')
            office_name = est.get('officeName')
            office_type = est.get('officeType')
            employees = est.get('numberEmployeesInterval')
            commercial_block = est.get('commercialBlockText')
            
            print(f"\n📍 Establishment #{idx}")
            print(f"   CFAR: {cfar}")
            print(f"   Office Name: {office_name}")
            print(f"   Office Type: {office_type}")
            if employees:
                print(f"   Employees: {employees}")
            if commercial_block:
                print(f"   Commercial Block: {commercial_block}")
            
            # Industry
            industry = est.get('industry', {})
            if industry:
                sni_code = industry.get('code')
                sni_text = industry.get('text')
                if sni_code or sni_text:
                    print(f"   Industry: {sni_code} - {sni_text}")
            
            # Postal Address
            address = est.get('address', {})
            if address:
                print(f"\n   📮 Postal Address:")
                self._print_address(address, indent="      ")
            
            # Visit Address
            visit_address = est.get('visitAddress', {})
            if visit_address:
                print(f"\n   🏢 Visit Address:")
                self._print_address(visit_address, indent="      ")
            
            # Contact
            contact = est.get('contact', {})
            if contact:
                phone = contact.get('phoneNumber')
                fax = contact.get('faxNumber')
                email = contact.get('email')
                
                if phone or fax or email:
                    print(f"\n   📞 Contact:")
                    if phone:
                        print(f"      Phone: {phone}")
                    if fax:
                        print(f"      Fax: {fax}")
                    if email:
                        print(f"      Email: {email}")
            
            # Verbose mode: show raw JSON
            if verbose:
                print(f"\n   🔍 Raw JSON:")
                print(f"      {json.dumps(est, indent=6, ensure_ascii=False)}")
    
    def _print_address(self, address: Dict[str, Any], indent: str = "   "):
        """Helper to print address structure"""
        co_address = address.get('coAddress')
        street = address.get('address')
        zip_code = address.get('zipCode')
        town = address.get('town')
        commune = address.get('commune')
        commune_code = address.get('communeCode')
        region = address.get('region')
        region_code = address.get('regionCode')
        
        if co_address:
            print(f"{indent}C/O: {co_address}")
        if street:
            print(f"{indent}Street: {street}")
        if zip_code or town:
            print(f"{indent}Postal: {zip_code} {town}".strip())
        if commune:
            print(f"{indent}Commune: {commune} ({commune_code})")
        if region:
            print(f"{indent}Region: {region} ({region_code})")
    
    def run_sandbox_tests(self):
        """
        Run comprehensive sandbox tests with multiple test cases
        """
        print("\n" + "="*80)
        print("ROARING.IO ESTABLISHMENTS API v2.0 - SANDBOX TESTS")
        print("="*80)
        
        test_cases = [
            {
                'name': 'Limited liability company (active, registered for tax)',
                'company_id': '5564866803'
            },
            {
                'name': 'Trading partnership (active)',
                'company_id': '9697715770'
            },
            {
                'name': 'Non-profit association',
                'company_id': '8394004322'
            },
            {
                'name': 'Limited liability company with 2 establishments',
                'company_id': '5592554108'
            },
            {
                'name': 'Limited liability company (active, registered for tax, head office)',
                'company_id': '5569994600'
            },
            {
                'name': 'Tenant-owner association',
                'company_id': '7696053631'
            }
        ]
        
        for idx, test_case in enumerate(test_cases, 1):
            print(f"\n\n🧪 TEST {idx}: {test_case['name']}")
            print(f"   Company ID: {test_case['company_id']}")
            print("-" * 80)
            
            result = self.get_establishments(test_case['company_id'])
            
            if result:
                self.print_result(result)
                
                # Save example for multi-establishment case
                if test_case['company_id'] == '5592554108':
                    with open('roaring_establishments_example_multi.json', 'w') as f:
                        json.dump(result, f, indent=2, ensure_ascii=False)
                    print("\n   💾 Example saved to: roaring_establishments_example_multi.json")
            else:
                print("   ❌ No data returned")
        
        print("\n" + "="*80)
        print("SANDBOX TESTS COMPLETE")
        print("="*80 + "\n")
    
    def compare_addresses(self, result: Dict[str, Any]):
        """
        Analyze differences between postal and visit addresses
        """
        establishments = result.get('establishments', [])
        
        print(f"\n{'='*80}")
        print("ADDRESS COMPARISON ANALYSIS")
        print(f"{'='*80}")
        
        for idx, est in enumerate(establishments, 1):
            cfar = est.get('companyEstablishmentNumber')
            postal = est.get('address', {})
            visit = est.get('visitAddress', {})
            
            postal_str = f"{postal.get('address', '')} {postal.get('zipCode', '')} {postal.get('town', '')}".strip()
            visit_str = f"{visit.get('address', '')} {visit.get('zipCode', '')} {visit.get('town', '')}".strip()
            
            print(f"\n📍 Establishment {cfar}:")
            print(f"   Postal: {postal_str}")
            print(f"   Visit:  {visit_str}")
            
            if postal_str == visit_str:
                print(f"   ✅ Addresses match")
            elif not visit_str:
                print(f"   ⚠️  No visit address provided")
            else:
                print(f"   🔴 ADDRESS MISMATCH - Different postal/visit addresses")
                print(f"       → Potential risk indicator (PTL 2 kap. 5 §: distansförhållande)")


def main():
    parser = argparse.ArgumentParser(
        description='Test Roaring.io Establishments API v2.0',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  # Get establishments for a company
  python3 test_roaring_establishments.py --company-id 5564866803
  
  # Verbose output with raw JSON
  python3 test_roaring_establishments.py --company-id 5564866803 --verbose
  
  # Compare postal vs visit addresses
  python3 test_roaring_establishments.py --company-id 5564866803 --compare-addresses
  
  # Run full sandbox test suite
  python3 test_roaring_establishments.py --sandbox
        """
    )
    
    parser.add_argument('--company-id', type=str,
                       help='Swedish organization number')
    parser.add_argument('--sandbox', action='store_true',
                       help='Run full sandbox test suite')
    parser.add_argument('--verbose', action='store_true',
                       help='Show raw JSON for each establishment')
    parser.add_argument('--compare-addresses', action='store_true',
                       help='Compare postal vs visit addresses')
    
    args = parser.parse_args()
    
    # Create tester instance
    tester = RoaringEstablishmentsTester()
    
    # Authenticate
    if not tester.authenticate():
        sys.exit(1)
    
    # Run sandbox tests
    if args.sandbox:
        tester.run_sandbox_tests()
        return
    
    # Require company_id for other operations
    if not args.company_id:
        print("❌ Error: --company-id is required (or use --sandbox)")
        sys.exit(1)
    
    # Fetch establishments
    result = tester.get_establishments(args.company_id)
    
    if result:
        tester.print_result(result, verbose=args.verbose)
        
        if args.compare_addresses:
            tester.compare_addresses(result)
    else:
        print("❌ No establishments found")
        sys.exit(1)


if __name__ == '__main__':
    main()
