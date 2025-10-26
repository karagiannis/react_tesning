#!/usr/bin/env python3
"""
Test script for Roaring.io Global Bank Account Information API 1.0

Tests two endpoints:
1. GET /account/details/{accountId} - Get account details and balances
2. GET /account/{accountId}/transactions - Get transaction history

Usage:
    # Test account details
    python3 test_bank_account_data.py --details <accountId> [--save]
    
    # Test transactions
    python3 test_bank_account_data.py --transactions <accountId> [--from-date YYYY-MM-DD] [--to-date YYYY-MM-DD] [--save]

Examples:
    python3 test_bank_account_data.py --details ABC123XYZ --save
    python3 test_bank_account_data.py --transactions ABC123XYZ --from-date 2025-01-01 --to-date 2025-10-25 --save

Author: Celestial Consulting
Created: 2025-10-25
API Documentation: https://api.roaring.io/global/bank-account-data/1.0
"""

import sys
import os
import json
import argparse
import requests
from datetime import datetime
from pathlib import Path

# Add parent directory (roaring root) to path to import credentials
roaring_root = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(roaring_root))

try:
    from credentials import get_oauth2_credentials
except ImportError:
    print("❌ Error: Cannot import credentials.py")
    print(f"   Make sure credentials.py exists in: {roaring_root}")
    sys.exit(1)

# API Configuration
API_BASE_URL = "https://api.roaring.io/global/bank-account-data/1.0"

def load_reference_data():
    """Load account types and balance types reference data."""
    script_dir = Path(__file__).parent
    
    account_types_path = script_dir / "roaring_account_types.json"
    balance_types_path = script_dir / "roaring_balance_types.json"
    
    account_types = {}
    balance_types = {}
    
    try:
        if account_types_path.exists():
            with open(account_types_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
                account_types = data.get('accountTypes', {})
    except Exception as e:
        print(f"⚠️  Warning: Could not load account types: {e}")
    
    try:
        if balance_types_path.exists():
            with open(balance_types_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
                balance_types = data.get('balanceTypes', {})
    except Exception as e:
        print(f"⚠️  Warning: Could not load balance types: {e}")
    
    return account_types, balance_types

def get_account_type_name(type_code, account_types):
    """Get human-readable account type name."""
    if not type_code or not account_types:
        return "Unknown"
    
    type_info = account_types.get(type_code, {})
    return type_info.get('description', type_code)

def get_balance_type_name(balance_code, balance_types):
    """Get human-readable balance type name."""
    if not balance_code or not balance_types:
        return "Unknown"
    
    balance_info = balance_types.get(balance_code, {})
    return balance_info.get('description', balance_code)

def test_account_details(account_id, save_result=False):
    """
    Test GET /account/details/{accountId} endpoint.
    
    Args:
        account_id: The account ID to query
        save_result: If True, saves response to JSON file
    
    Returns:
        dict: API response or None if error
    """
    print("=" * 70)
    print("🏦 Bank Account Data API - Account Details Endpoint Test")
    print("=" * 70)
    print(f"Account ID: {account_id}")
    print(f"Endpoint: GET /account/details/{account_id}\n")
    
    # Load reference data
    account_types, balance_types = load_reference_data()
    
    # Step 1: Get OAuth2 token
    print("=" * 70)
    print("Step 1: Getting OAuth2 access token...")
    print("=" * 70)
    
    try:
        credentials = get_oauth2_credentials()
        print("✅ Credentials loaded\n")
    except Exception as e:
        print(f"❌ Failed to get credentials: {e}")
        return None
    
    access_token = credentials.get('access_token')
    if not access_token:
        print("❌ No access token received")
        return None
    
    print("✅ Authentication successful")
    expires_in = credentials.get('expires_in', 'unknown')
    print(f"   Token expires in: {expires_in} seconds\n")
    
    # Step 2: Query API
    print("=" * 70)
    print("Step 2: Querying Bank Account Data API...")
    print("=" * 70)
    
    url = f"{API_BASE_URL}/account/details/{account_id}"
    headers = {
        'Authorization': f'Bearer {access_token}',
        'Accept': 'application/json'
    }
    
    print(f"Request URL: {url}")
    
    try:
        response = requests.get(url, headers=headers, timeout=30)
        print(f"Status Code: {response.status_code}\n")
        
        # Step 3: Display response
        print("=" * 70)
        print("API Response:")
        print("=" * 70)
        
        try:
            response_data = response.json()
            print(json.dumps(response_data, indent=2, ensure_ascii=False))
        except json.JSONDecodeError:
            print(response.text)
            response_data = {"error": "Invalid JSON response", "raw": response.text}
        
        # Step 4: Analysis
        print("\n" + "=" * 70)
        print("Analysis:")
        print("=" * 70)
        
        if response.status_code == 200:
            print("✅ Account details retrieved successfully\n")
            
            # Analyze account information
            if isinstance(response_data, dict):
                # Account type
                account_type = response_data.get('accountType')
                if account_type:
                    type_name = get_account_type_name(account_type, account_types)
                    print(f"Account Type: {type_name} ({account_type})")
                
                # Account name/description
                account_name = response_data.get('name') or response_data.get('accountName')
                if account_name:
                    print(f"Account Name: {account_name}")
                
                # IBAN
                iban = response_data.get('iban')
                if iban:
                    print(f"IBAN: {iban}")
                
                # Currency
                currency = response_data.get('currency')
                if currency:
                    print(f"Currency: {currency}")
                
                # Balances
                balances = response_data.get('balances', [])
                if balances:
                    print(f"\nBalances ({len(balances)} found):")
                    for idx, balance in enumerate(balances, 1):
                        balance_type = balance.get('balanceType')
                        balance_amount = balance.get('balanceAmount', {})
                        amount = balance_amount.get('amount')
                        bal_currency = balance_amount.get('currency')
                        
                        type_name = get_balance_type_name(balance_type, balance_types)
                        
                        print(f"  {idx}. {type_name} ({balance_type}): {amount} {bal_currency}")
                        
                        # Reference date if available
                        ref_date = balance.get('referenceDate')
                        if ref_date:
                            print(f"     Reference date: {ref_date}")
        
        elif response.status_code == 400:
            print("❌ Bad Request - Invalid account ID or parameters")
        elif response.status_code == 403:
            print("❌ Forbidden - Insufficient authentication credentials")
        elif response.status_code == 404:
            print("❌ Not Found - Account does not exist or access not granted")
        elif response.status_code == 500:
            print("❌ Server Error - Contact system administrator")
        else:
            print(f"⚠️  Unexpected status code: {response.status_code}")
        
        # Save result if requested
        if save_result:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"result_account_details_{account_id}_{timestamp}.json"
            filepath = Path(__file__).parent / filename
            
            with open(filepath, 'w', encoding='utf-8') as f:
                json.dump(response_data, f, indent=2, ensure_ascii=False)
            
            print(f"\n💾 Result saved to: {filename}")
        
        return response_data
        
    except requests.exceptions.Timeout:
        print("❌ Request timed out after 30 seconds")
        return None
    except requests.exceptions.RequestException as e:
        print(f"❌ Request failed: {e}")
        return None

def test_account_transactions(account_id, from_date=None, to_date=None, save_result=False):
    """
    Test GET /account/{accountId}/transactions endpoint.
    
    Args:
        account_id: The account ID to query
        from_date: Start date (YYYY-MM-DD format)
        to_date: End date (YYYY-MM-DD format)
        save_result: If True, saves response to JSON file
    
    Returns:
        dict: API response or None if error
    """
    print("=" * 70)
    print("💳 Bank Account Data API - Transactions Endpoint Test")
    print("=" * 70)
    print(f"Account ID: {account_id}")
    if from_date:
        print(f"From Date: {from_date}")
    if to_date:
        print(f"To Date: {to_date}")
    print(f"Endpoint: GET /account/{account_id}/transactions\n")
    
    # Step 1: Get OAuth2 token
    print("=" * 70)
    print("Step 1: Getting OAuth2 access token...")
    print("=" * 70)
    
    try:
        credentials = get_oauth2_credentials()
        print("✅ Credentials loaded\n")
    except Exception as e:
        print(f"❌ Failed to get credentials: {e}")
        return None
    
    access_token = credentials.get('access_token')
    if not access_token:
        print("❌ No access token received")
        return None
    
    print("✅ Authentication successful\n")
    
    # Step 2: Query API
    print("=" * 70)
    print("Step 2: Querying Bank Account Data API...")
    print("=" * 70)
    
    url = f"{API_BASE_URL}/account/{account_id}/transactions"
    headers = {
        'Authorization': f'Bearer {access_token}',
        'Accept': 'application/json'
    }
    
    params = {}
    if from_date:
        params['fromDate'] = from_date
    if to_date:
        params['toDate'] = to_date
    
    print(f"Request URL: {url}")
    if params:
        print(f"Parameters: {params}")
    
    try:
        response = requests.get(url, headers=headers, params=params, timeout=30)
        print(f"Status Code: {response.status_code}\n")
        
        # Step 3: Display response
        print("=" * 70)
        print("API Response:")
        print("=" * 70)
        
        try:
            response_data = response.json()
            print(json.dumps(response_data, indent=2, ensure_ascii=False))
        except json.JSONDecodeError:
            print(response.text)
            response_data = {"error": "Invalid JSON response", "raw": response.text}
        
        # Step 4: Analysis
        print("\n" + "=" * 70)
        print("Analysis:")
        print("=" * 70)
        
        if response.status_code == 200:
            print("✅ Transactions retrieved successfully\n")
            
            # Analyze transactions
            if isinstance(response_data, dict):
                transactions = response_data.get('transactions', [])
                
                if transactions:
                    print(f"Total transactions: {len(transactions)}\n")
                    
                    # Summary statistics
                    total_debit = 0
                    total_credit = 0
                    
                    for trans in transactions:
                        amount = trans.get('transactionAmount', {}).get('amount', 0)
                        try:
                            amount_float = float(amount)
                            if amount_float < 0:
                                total_debit += abs(amount_float)
                            else:
                                total_credit += amount_float
                        except (ValueError, TypeError):
                            pass
                    
                    print(f"Total debits: {total_debit:.2f}")
                    print(f"Total credits: {total_credit:.2f}")
                    print(f"Net change: {(total_credit - total_debit):.2f}\n")
                    
                    # Show first few transactions
                    print("First 5 transactions:")
                    for idx, trans in enumerate(transactions[:5], 1):
                        booking_date = trans.get('bookingDate', 'N/A')
                        amount_info = trans.get('transactionAmount', {})
                        amount = amount_info.get('amount', 'N/A')
                        currency = amount_info.get('currency', '')
                        description = trans.get('remittanceInformationUnstructured', 'No description')
                        
                        print(f"  {idx}. {booking_date}: {amount} {currency}")
                        print(f"     {description[:60]}...")
                else:
                    print("No transactions found for the specified period")
        
        elif response.status_code == 400:
            print("❌ Bad Request - Invalid parameters or date format")
        elif response.status_code == 403:
            print("❌ Forbidden - Insufficient authentication credentials")
        elif response.status_code == 404:
            print("❌ Not Found - Account does not exist or access not granted")
        elif response.status_code == 500:
            print("❌ Server Error - Contact system administrator")
        else:
            print(f"⚠️  Unexpected status code: {response.status_code}")
        
        # Save result if requested
        if save_result:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"result_transactions_{account_id}_{timestamp}.json"
            filepath = Path(__file__).parent / filename
            
            with open(filepath, 'w', encoding='utf-8') as f:
                json.dump(response_data, f, indent=2, ensure_ascii=False)
            
            print(f"\n💾 Result saved to: {filename}")
        
        return response_data
        
    except requests.exceptions.Timeout:
        print("❌ Request timed out after 30 seconds")
        return None
    except requests.exceptions.RequestException as e:
        print(f"❌ Request failed: {e}")
        return None

def main():
    parser = argparse.ArgumentParser(
        description='Test Roaring.io Global Bank Account Information API 1.0',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  # Test account details
  python3 test_bank_account_data.py --details ABC123XYZ --save
  
  # Test transactions with date range
  python3 test_bank_account_data.py --transactions ABC123XYZ --from-date 2025-01-01 --to-date 2025-10-25 --save
        """
    )
    
    # Endpoint selection (mutually exclusive)
    endpoint_group = parser.add_mutually_exclusive_group(required=True)
    endpoint_group.add_argument('--details', type=str, metavar='ACCOUNT_ID',
                                help='Test account details endpoint with account ID')
    endpoint_group.add_argument('--transactions', type=str, metavar='ACCOUNT_ID',
                                help='Test transactions endpoint with account ID')
    
    # Transaction date filters
    parser.add_argument('--from-date', type=str, metavar='YYYY-MM-DD',
                       help='Start date for transactions (format: YYYY-MM-DD)')
    parser.add_argument('--to-date', type=str, metavar='YYYY-MM-DD',
                       help='End date for transactions (format: YYYY-MM-DD)')
    
    # Save result flag
    parser.add_argument('--save', action='store_true',
                       help='Save API response to JSON file')
    
    args = parser.parse_args()
    
    # Validate date format if provided
    if args.from_date:
        try:
            datetime.strptime(args.from_date, '%Y-%m-%d')
        except ValueError:
            print("❌ Error: --from-date must be in YYYY-MM-DD format")
            sys.exit(1)
    
    if args.to_date:
        try:
            datetime.strptime(args.to_date, '%Y-%m-%d')
        except ValueError:
            print("❌ Error: --to-date must be in YYYY-MM-DD format")
            sys.exit(1)
    
    # Date filters only valid for transactions
    if (args.from_date or args.to_date) and not args.transactions:
        print("❌ Error: --from-date and --to-date can only be used with --transactions")
        sys.exit(1)
    
    # Execute appropriate test
    if args.details:
        test_account_details(args.details, save_result=args.save)
    elif args.transactions:
        test_account_transactions(args.transactions, 
                                 from_date=args.from_date, 
                                 to_date=args.to_date,
                                 save_result=args.save)

if __name__ == "__main__":
    main()
