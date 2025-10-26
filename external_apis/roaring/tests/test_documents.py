#!/usr/bin/env python3
"""
Roaring.io Company Documents API v1.0 Test Script

Tests all endpoints for fetching company documents from Bolagsverket:
- List documents (with optional filter)
- Fetch registration certification
- Fetch annual reports
- Fetch interim reports
- Fetch meeting minutes
- Fetch articles of association (limited companies)
- Fetch articles of association (non-limited companies)
- Fetch financial plans

Author: Celestial AB
Date: 2025-10-25
API Docs: https://api.roaring.io/se/company/document/1.0
"""

import requests
import json
import sys
import argparse
from typing import Optional, Dict, Any
from pathlib import Path

# Add parent directory to path to import credentials
sys.path.insert(0, str(Path(__file__).parent.parent))
from credentials import get_oauth2_credentials


class RoaringDocumentsTester:
    """Test harness for Roaring.io Company Documents API v1.0"""
    
    def __init__(self):
        self.base_url = "https://api.roaring.io/se/company/document/1.0"
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
    
    def list_documents(
        self,
        company_id: str,
        document_types: Optional[List[str]] = None
    ) -> Optional[Dict[str, Any]]:
        """
        List available documents for a company
        
        Args:
            company_id: Swedish organization number (e.g., "5564779444")
            document_types: Optional filter for document types (array)
        
        Returns:
            ListDocumentResult with records[] and status
        """
        url = f"{self.base_url}/{company_id}"
        
        params = {}
        if document_types:
            params['documentType'] = document_types
        
        try:
            response = requests.get(url, headers=self._get_headers(), params=params)
            
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
            print(f"❌ Error listing documents: {e}")
            return None
    
    def fetch_registration_certification(
        self,
        company_id: str
    ) -> Optional[Dict[str, Any]]:
        """
        Fetch registration certification (registreringsbevis)
        
        Args:
            company_id: Swedish organization number
        
        Returns:
            OrderDocumentResult with downloadLink
        """
        url = f"{self.base_url}/{company_id}/registration_certification"
        
        try:
            response = requests.get(url, headers=self._get_headers())
            
            if response.status_code == 200:
                return response.json()
            elif response.status_code == 404:
                print(f"❌ Registration certification not found for {company_id}")
                return None
            else:
                print(f"❌ Request failed: {response.status_code}")
                print(response.text)
                return None
                
        except Exception as e:
            print(f"❌ Error fetching registration certification: {e}")
            return None
    
    def fetch_annual_report(
        self,
        company_id: str,
        document_id: str
    ) -> Optional[Dict[str, Any]]:
        """
        Fetch annual report (årsredovisning)
        
        Args:
            company_id: Swedish organization number
            document_id: Document ID from list_documents()
        
        Returns:
            OrderDocumentResult with downloadLink
        """
        url = f"{self.base_url}/{company_id}/annual_report/{document_id}"
        
        try:
            response = requests.get(url, headers=self._get_headers())
            
            if response.status_code == 200:
                return response.json()
            elif response.status_code == 404:
                print(f"❌ Annual report not found")
                return None
            else:
                print(f"❌ Request failed: {response.status_code}")
                print(response.text)
                return None
                
        except Exception as e:
            print(f"❌ Error fetching annual report: {e}")
            return None
    
    def fetch_interim_report(
        self,
        company_id: str,
        document_id: str
    ) -> Optional[Dict[str, Any]]:
        """
        Fetch interim report (delårsrapport)
        
        Args:
            company_id: Swedish organization number
            document_id: Document ID from list_documents()
        
        Returns:
            OrderDocumentResult with downloadLink
        """
        url = f"{self.base_url}/{company_id}/interim_report/{document_id}"
        
        try:
            response = requests.get(url, headers=self._get_headers())
            
            if response.status_code == 200:
                return response.json()
            else:
                print(f"❌ Request failed: {response.status_code}")
                return None
                
        except Exception as e:
            print(f"❌ Error fetching interim report: {e}")
            return None
    
    def fetch_meeting_minutes(
        self,
        company_id: str,
        document_id: str
    ) -> Optional[Dict[str, Any]]:
        """
        Fetch meeting minutes (stämmoprotokoll)
        
        Args:
            company_id: Swedish organization number
            document_id: Document ID from list_documents()
        
        Returns:
            OrderDocumentResult with downloadLink
        """
        url = f"{self.base_url}/{company_id}/meeting_minutes/{document_id}"
        
        try:
            response = requests.get(url, headers=self._get_headers())
            
            if response.status_code == 200:
                return response.json()
            else:
                print(f"❌ Request failed: {response.status_code}")
                return None
                
        except Exception as e:
            print(f"❌ Error fetching meeting minutes: {e}")
            return None
    
    def fetch_articles_of_association(
        self,
        company_id: str,
        document_id: str
    ) -> Optional[Dict[str, Any]]:
        """
        Fetch articles of association (bolagsordning) for limited companies
        
        Args:
            company_id: Swedish organization number
            document_id: Document ID from list_documents()
        
        Returns:
            OrderDocumentResult with downloadLink
        """
        url = f"{self.base_url}/{company_id}/articles_of_association/{document_id}"
        
        try:
            response = requests.get(url, headers=self._get_headers())
            
            if response.status_code == 200:
                return response.json()
            else:
                print(f"❌ Request failed: {response.status_code}")
                return None
                
        except Exception as e:
            print(f"❌ Error fetching articles of association: {e}")
            return None
    
    def fetch_articles_of_association_nonlimited(
        self,
        company_id: str,
        document_id: str
    ) -> Optional[Dict[str, Any]]:
        """
        Fetch articles of association (stadgar) for non-limited companies
        
        Args:
            company_id: Swedish organization number
            document_id: Document ID from list_documents()
        
        Returns:
            OrderDocumentResult with downloadLink
        """
        url = f"{self.base_url}/{company_id}/articles_of_association_nonlimited/{document_id}"
        
        try:
            response = requests.get(url, headers=self._get_headers())
            
            if response.status_code == 200:
                return response.json()
            else:
                print(f"❌ Request failed: {response.status_code}")
                return None
                
        except Exception as e:
            print(f"❌ Error fetching articles of association (non-limited): {e}")
            return None
    
    def fetch_financial_plan(
        self,
        company_id: str,
        document_id: str
    ) -> Optional[Dict[str, Any]]:
        """
        Fetch financial plan (finansieringsplan)
        
        Args:
            company_id: Swedish organization number
            document_id: Document ID from list_documents()
        
        Returns:
            OrderDocumentResult with downloadLink
        """
        url = f"{self.base_url}/{company_id}/financial_plan/{document_id}"
        
        try:
            response = requests.get(url, headers=self._get_headers())
            
            if response.status_code == 200:
                return response.json()
            else:
                print(f"❌ Request failed: {response.status_code}")
                return None
                
        except Exception as e:
            print(f"❌ Error fetching financial plan: {e}")
            return None
    
    def print_list_result(self, result: Dict[str, Any]):
        """Pretty print list documents result"""
        if not result:
            return
        
        status = result.get('status', {})
        records = result.get('records', [])
        
        print(f"\n{'='*80}")
        print(f"Status: Code {status.get('code')} - {status.get('text')}")
        print(f"Found {len(records)} company record(s)")
        print(f"{'='*80}")
        
        for record in records:
            company_id = record.get('companyId')
            company_name = record.get('companyName')
            documents = record.get('documents', [])
            
            print(f"\n📋 Company: {company_name} ({company_id})")
            print(f"   Documents: {len(documents)}")
            
            for doc in documents:
                doc_type = doc.get('documentType')
                doc_id = doc.get('id')
                doc_date = doc.get('date')
                doc_status = doc.get('status')
                file_type = doc.get('fileType')
                
                status_icon = "✅" if doc_status == "available" else "🔒"
                print(f"   {status_icon} {doc_type}")
                print(f"      ID: {doc_id}")
                print(f"      Date: {doc_date}")
                print(f"      Status: {doc_status}")
                print(f"      File Type: {file_type}")
    
    def print_order_result(self, result: Dict[str, Any], doc_type: str):
        """Pretty print order/fetch result with download link"""
        if not result:
            return
        
        status = result.get('status', {})
        records = result.get('records', [])
        
        print(f"\n{'='*80}")
        print(f"Fetched: {doc_type}")
        print(f"Status: Code {status.get('code')} - {status.get('text')}")
        print(f"{'='*80}")
        
        for record in records:
            company_id = record.get('companyId')
            company_name = record.get('companyName')
            documents = record.get('documents', [])
            
            print(f"\n📋 Company: {company_name} ({company_id})")
            
            for doc in documents:
                doc_id = doc.get('id')
                doc_date = doc.get('date')
                download_link = doc.get('downloadLink', {})
                
                print(f"\n   Document ID: {doc_id}")
                print(f"   Date: {doc_date}")
                
                if download_link:
                    print(f"   📥 Download Link:")
                    print(f"      Type: {download_link.get('type')}")
                    print(f"      URL: {download_link.get('url')[:80]}...")
                else:
                    print(f"   ⚠️  No download link available")
    
    def run_sandbox_tests(self, company_id: str = "5564779444"):
        """
        Run comprehensive sandbox tests
        
        Args:
            company_id: Sandbox company ID (default: 5564779444)
        """
        print("\n" + "="*80)
        print("ROARING.IO COMPANY DOCUMENTS API v1.0 - SANDBOX TESTS")
        print("="*80)
        
        # Test 1: List all documents
        print("\n\n🧪 TEST 1: List all documents")
        print("-" * 80)
        result = self.list_documents(company_id)
        if result:
            self.print_list_result(result)
            
            # Extract document IDs for further testing
            records = result.get('records', [])
            if records:
                documents = records[0].get('documents', [])
                
                # Test 2: Filter by document type
                print("\n\n🧪 TEST 2: List only ANNUAL_REPORT documents")
                print("-" * 80)
                filtered_result = self.list_documents(
                    company_id,
                    document_types=["ANNUAL_REPORT"]
                )
                if filtered_result:
                    self.print_list_result(filtered_result)
                
                # Test 3: Fetch registration certification
                print("\n\n🧪 TEST 3: Fetch registration certification")
                print("-" * 80)
                cert_result = self.fetch_registration_certification(company_id)
                if cert_result:
                    self.print_order_result(cert_result, "REGISTRATION_CERTIFICATION")
                
                # Test 4: Fetch annual report (if available)
                annual_reports = [d for d in documents if d.get('documentType') == 'ANNUAL_REPORT']
                if annual_reports and annual_reports[0].get('status') == 'available':
                    print("\n\n🧪 TEST 4: Fetch annual report")
                    print("-" * 80)
                    doc_id = annual_reports[0].get('id')
                    report_result = self.fetch_annual_report(company_id, doc_id)
                    if report_result:
                        self.print_order_result(report_result, "ANNUAL_REPORT")
                        
                        # Save example response
                        with open('roaring_documents_example_annual_report.json', 'w') as f:
                            json.dump(report_result, f, indent=2, ensure_ascii=False)
                        print("\n   💾 Example saved to: roaring_documents_example_annual_report.json")
                else:
                    print("\n\n🧪 TEST 4: Fetch annual report - SKIPPED (not available)")
                
                # Test 5: Fetch articles of association (if available)
                articles = [d for d in documents if d.get('documentType') == 'ARTICLES_OF_ASSOCIATION']
                if articles and articles[0].get('status') == 'available':
                    print("\n\n🧪 TEST 5: Fetch articles of association")
                    print("-" * 80)
                    doc_id = articles[0].get('id')
                    articles_result = self.fetch_articles_of_association(company_id, doc_id)
                    if articles_result:
                        self.print_order_result(articles_result, "ARTICLES_OF_ASSOCIATION")
                else:
                    print("\n\n🧪 TEST 5: Fetch articles of association - SKIPPED (not available)")
        
        print("\n" + "="*80)
        print("SANDBOX TESTS COMPLETE")
        print("="*80 + "\n")


def main():
    parser = argparse.ArgumentParser(
        description='Test Roaring.io Company Documents API v1.0',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  # List all documents for a company
  python3 test_roaring_documents.py --list --company-id 5564779444
  
  # List only annual reports
  python3 test_roaring_documents.py --list --company-id 5564779444 --filter ANNUAL_REPORT
  
  # Fetch registration certification
  python3 test_roaring_documents.py --cert --company-id 5564779444
  
  # Fetch annual report
  python3 test_roaring_documents.py --annual-report --company-id 5564779444 --doc-id <document_id>
  
  # Run full sandbox test suite
  python3 test_roaring_documents.py --sandbox
  python3 test_roaring_documents.py --sandbox --company-id 5569876543
        """
    )
    
    parser.add_argument('--list', action='store_true',
                       help='List available documents')
    parser.add_argument('--cert', action='store_true',
                       help='Fetch registration certification')
    parser.add_argument('--annual-report', action='store_true',
                       help='Fetch annual report')
    parser.add_argument('--interim-report', action='store_true',
                       help='Fetch interim report')
    parser.add_argument('--meeting-minutes', action='store_true',
                       help='Fetch meeting minutes')
    parser.add_argument('--articles', action='store_true',
                       help='Fetch articles of association')
    parser.add_argument('--articles-nonlimited', action='store_true',
                       help='Fetch articles of association (non-limited)')
    parser.add_argument('--financial-plan', action='store_true',
                       help='Fetch financial plan')
    parser.add_argument('--company-id', type=str,
                       help='Swedish organization number')
    parser.add_argument('--doc-id', type=str,
                       help='Document ID (required for fetch operations)')
    parser.add_argument('--filter', action='append',
                       help='Filter by document type (can be used multiple times)')
    parser.add_argument('--sandbox', action='store_true',
                       help='Run full sandbox test suite')
    
    args = parser.parse_args()
    
    # Create tester instance
    tester = RoaringDocumentsTester()
    
    # Authenticate
    if not tester.authenticate():
        sys.exit(1)
    
    # Run sandbox tests
    if args.sandbox:
        company_id = args.company_id or "5564779444"
        tester.run_sandbox_tests(company_id)
        return
    
    # Require company_id for other operations
    if not args.company_id:
        print("❌ Error: --company-id is required (or use --sandbox)")
        sys.exit(1)
    
    # List documents
    if args.list:
        result = tester.list_documents(args.company_id, args.filter)
        if result:
            tester.print_list_result(result)
    
    # Fetch registration certification
    elif args.cert:
        result = tester.fetch_registration_certification(args.company_id)
        if result:
            tester.print_order_result(result, "REGISTRATION_CERTIFICATION")
    
    # Fetch annual report
    elif args.annual_report:
        if not args.doc_id:
            print("❌ Error: --doc-id is required for fetching annual report")
            sys.exit(1)
        result = tester.fetch_annual_report(args.company_id, args.doc_id)
        if result:
            tester.print_order_result(result, "ANNUAL_REPORT")
    
    # Fetch interim report
    elif args.interim_report:
        if not args.doc_id:
            print("❌ Error: --doc-id is required for fetching interim report")
            sys.exit(1)
        result = tester.fetch_interim_report(args.company_id, args.doc_id)
        if result:
            tester.print_order_result(result, "INTERIM_REPORT")
    
    # Fetch meeting minutes
    elif args.meeting_minutes:
        if not args.doc_id:
            print("❌ Error: --doc-id is required for fetching meeting minutes")
            sys.exit(1)
        result = tester.fetch_meeting_minutes(args.company_id, args.doc_id)
        if result:
            tester.print_order_result(result, "MEETING_MINUTES")
    
    # Fetch articles of association
    elif args.articles:
        if not args.doc_id:
            print("❌ Error: --doc-id is required for fetching articles")
            sys.exit(1)
        result = tester.fetch_articles_of_association(args.company_id, args.doc_id)
        if result:
            tester.print_order_result(result, "ARTICLES_OF_ASSOCIATION")
    
    # Fetch articles of association (non-limited)
    elif args.articles_nonlimited:
        if not args.doc_id:
            print("❌ Error: --doc-id is required for fetching articles (non-limited)")
            sys.exit(1)
        result = tester.fetch_articles_of_association_nonlimited(args.company_id, args.doc_id)
        if result:
            tester.print_order_result(result, "ARTICLES_OF_ASSOCIATION_NONLIMITED")
    
    # Fetch financial plan
    elif args.financial_plan:
        if not args.doc_id:
            print("❌ Error: --doc-id is required for fetching financial plan")
            sys.exit(1)
        result = tester.fetch_financial_plan(args.company_id, args.doc_id)
        if result:
            tester.print_order_result(result, "FINANCIAL_PLAN")
    
    else:
        print("❌ Error: No operation specified. Use --list, --cert, --annual-report, etc.")
        print("Run with --help for usage information")
        sys.exit(1)


if __name__ == '__main__':
    main()
