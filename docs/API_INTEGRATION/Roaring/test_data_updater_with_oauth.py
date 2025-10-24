#!/usr/bin/env python3
"""
Roaring Data Updater API - Complete Test Suite with OAuth2

This script:
1. Authenticates with Roaring OAuth2 (using client_id + client_secret)
2. Gets access token
3. Runs all Data Updater API tests
4. Tests webhook endpoints

Usage:
    # Set credentials (one time):
    export ROARING_CLIENT_ID="your_client_id"
    export ROARING_CLIENT_SECRET="your_client_secret"
    export ROARING_WEBHOOK_ID="your_webhook_id"  # Optional
    
    # Run tests:
    python3 test_data_updater_with_oauth.py

Requirements:
    pip3 install requests
"""

import requests
import json
import time
import sys
import os
from datetime import datetime

# ============================================================================
# CONFIGURATION
# ============================================================================

# OAuth2 settings - Try different endpoints
OAUTH_TOKEN_URLS = [
    "https://auth.roaring.io/oauth/token",  # Most common
    "https://api.roaring.io/oauth/token",
    "https://login.roaring.io/oauth/token",
    "https://id.roaring.io/oauth/token",
    "https://api.roaring.io/oauth2/token",
]
CLIENT_ID = os.getenv("ROARING_CLIENT_ID", "")
CLIENT_SECRET = os.getenv("ROARING_CLIENT_SECRET", "")

# API settings
BASE_URL = "https://api.roaring.io/se/company/current-information/1.0"
WEBHOOK_ID = os.getenv("ROARING_WEBHOOK_ID", "webhook-test-123")

# Test company
TEST_COMPANY_ID = "5564881422"

# Global token storage
ACCESS_TOKEN = None
TOKEN_EXPIRES_AT = None

# ============================================================================
# OAUTH2 AUTHENTICATION
# ============================================================================

def get_access_token():
    """Get OAuth2 access token using client credentials - Try multiple endpoints"""
    global ACCESS_TOKEN, TOKEN_EXPIRES_AT
    
    print("\n" + "=" * 70)
    print("  OAUTH2 AUTHENTICATION")
    print("=" * 70)
    
    if not CLIENT_ID or not CLIENT_SECRET:
        print("❌ ERROR: Missing credentials")
        print("\nPlease set environment variables:")
        print("  export ROARING_CLIENT_ID='your_client_id'")
        print("  export ROARING_CLIENT_SECRET='your_client_secret'")
        return False
    
    print(f"Client ID: {CLIENT_ID[:15]}...")
    
    payload = {
        "grant_type": "client_credentials",
        "client_id": CLIENT_ID,
        "client_secret": CLIENT_SECRET,
        "scope": "company:read"  # Adjust as needed
    }
    
    # Try each OAuth endpoint
    for i, token_url in enumerate(OAUTH_TOKEN_URLS, 1):
        print(f"\n🔑 Attempt {i}/{len(OAUTH_TOKEN_URLS)}: {token_url}")
        
        try:
            response = requests.post(
                token_url,
                data=payload,
                headers={"Content-Type": "application/x-www-form-urlencoded"},
                timeout=10
            )
            
            print(f"   Status: {response.status_code}")
            
            if response.status_code == 200:
                data = response.json()
                ACCESS_TOKEN = data.get('access_token')
                expires_in = data.get('expires_in', 3600)
                TOKEN_EXPIRES_AT = time.time() + expires_in
                
                print(f"   ✅ Token received!")
                print(f"   Expires in: {expires_in / 60:.1f} minutes")
                print(f"   Token: {ACCESS_TOKEN[:30]}...")
                return True
            elif response.status_code in [401, 403]:
                print(f"   ❌ Auth failed (wrong credentials?)")
            elif response.status_code == 404:
                print(f"   ⚠️  Endpoint not found, trying next...")
            elif response.status_code == 503:
                print(f"   ⚠️  Service unavailable, trying next...")
            else:
                print(f"   ⚠️  Error {response.status_code}, trying next...")
                
        except requests.exceptions.Timeout:
            print(f"   ⏱️  Timeout, trying next...")
        except requests.exceptions.ConnectionError:
            print(f"   🔌 Connection error, trying next...")
        except Exception as e:
            print(f"   ❌ Exception: {e}")
    
    print("\n❌ All OAuth endpoints failed!")
    print("\n💡 POSSIBLE REASONS:")
    print("  1. Wrong CLIENT_ID or CLIENT_SECRET")
    print("  2. Roaring uses different OAuth endpoint (check docs)")
    print("  3. API might not use OAuth2 (might use API key instead)")
    print("  4. Network/firewall blocking requests")
    
    return False

def get_headers():
    """Return headers with current access token"""
    return {
        "Authorization": f"Bearer {ACCESS_TOKEN}",
        "Accept": "application/json",
        "Content-Type": "application/json"
    }

# ============================================================================
# TEST FUNCTIONS
# ============================================================================

def test_list_services():
    """Test 1: Lista tillgängliga services"""
    print("\n" + "=" * 70)
    print("  TEST 1: Lista services")
    print("=" * 70)
    
    try:
        response = requests.get(
            f"{BASE_URL}/services",
            headers=get_headers()
        )
        
        print(f"Status: {response.status_code}")
        data = response.json()
        print(json.dumps(data, indent=2, ensure_ascii=False))
        
        if response.status_code == 200:
            services = data.get('services', [])
            print(f"\n✅ Found {len(services)} services")
            for svc in services:
                print(f"  • {svc.get('name')}")
            return True
        else:
            print("\n❌ Failed")
            return False
            
    except Exception as e:
        print(f"\n❌ Exception: {e}")
        return False

def test_list_webhooks():
    """Test 2: Lista webhooks"""
    print("\n" + "=" * 70)
    print("  TEST 2: Lista webhooks")
    print("=" * 70)
    
    try:
        response = requests.get(
            f"{BASE_URL}/webhooks",
            headers=get_headers()
        )
        
        print(f"Status: {response.status_code}")
        data = response.json()
        print(json.dumps(data, indent=2, ensure_ascii=False))
        
        if response.status_code == 200:
            webhooks = data.get('webhooks', [])
            print(f"\n✅ Found {len(webhooks)} webhooks")
            for wh in webhooks:
                print(f"  • {wh.get('id')}: {wh.get('url')}")
            return True
        else:
            print("\n❌ Failed")
            return False
            
    except Exception as e:
        print(f"\n❌ Exception: {e}")
        return False

def test_validate_file():
    """Test 3: Validera fil med org.nr"""
    print("\n" + "=" * 70)
    print("  TEST 3: Validera fil")
    print("=" * 70)
    
    test_file_path = '/tmp/test_orgnr_roaring.txt'
    test_content = """5564881422
5590523865
556INVALID
5569876543"""
    
    print(f"\nSkapar testfil: {test_file_path}")
    
    try:
        with open(test_file_path, 'w') as f:
            f.write(test_content)
        
        with open(test_file_path, 'rb') as f:
            files = {'file': ('test_orgnr.txt', f, 'text/plain')}
            response = requests.put(
                f"{BASE_URL}/validate",
                headers={"Authorization": f"Bearer {ACCESS_TOKEN}"},
                files=files
            )
        
        print(f"Status: {response.status_code}")
        data = response.json()
        print(json.dumps(data, indent=2, ensure_ascii=False))
        
        if response.status_code == 200:
            print(f"\n✅ Validation complete")
            print(f"  Valid: {data.get('valid')}")
            print(f"  Good IDs: {data.get('goodIdsQuantity')}")
            print(f"  Bad IDs: {data.get('badIdsQuantity')}")
            return True
        else:
            print("\n❌ Failed")
            return False
            
    except Exception as e:
        print(f"\n❌ Exception: {e}")
        return False

def test_list_tasks():
    """Test 4: Lista aktiva tasks"""
    print("\n" + "=" * 70)
    print("  TEST 4: Lista tasks")
    print("=" * 70)
    
    try:
        response = requests.get(
            f"{BASE_URL}/tasks",
            headers=get_headers()
        )
        
        print(f"Status: {response.status_code}")
        data = response.json()
        print(json.dumps(data, indent=2, ensure_ascii=False))
        
        if response.status_code == 200:
            tasks = data.get('tasks', [])
            print(f"\n✅ Found {len(tasks)} tasks")
            for task in tasks:
                print(f"  • {task.get('id')}: {task.get('status')}")
            return True
        else:
            print("\n❌ Failed")
            return False
            
    except Exception as e:
        print(f"\n❌ Exception: {e}")
        return False

def test_start_task():
    """Test 5: Starta övervakningsuppgift"""
    print("\n" + "=" * 70)
    print("  TEST 5: Starta task")
    print("=" * 70)
    
    payload = {
        "companyIds": [TEST_COMPANY_ID],
        "services": ["BOARD_MEMBERS", "BENEFICIAL_OWNER"]
    }
    
    print(f"\nWebhook ID: {WEBHOOK_ID}")
    print(f"Company: {TEST_COMPANY_ID}")
    print(f"Services: {payload['services']}")
    
    try:
        response = requests.put(
            f"{BASE_URL}/start/{WEBHOOK_ID}",
            headers=get_headers(),
            json=payload
        )
        
        print(f"\nStatus: {response.status_code}")
        data = response.json()
        print(json.dumps(data, indent=2, ensure_ascii=False))
        
        if response.status_code == 200:
            task = data.get('task', {})
            task_id = task.get('id')
            print(f"\n✅ Task created: {task_id}")
            return task_id
        else:
            print("\n❌ Failed")
            return None
            
    except Exception as e:
        print(f"\n❌ Exception: {e}")
        return None

def test_task_status(task_id):
    """Test 6: Hämta task status"""
    print("\n" + "=" * 70)
    print(f"  TEST 6: Task status")
    print("=" * 70)
    
    try:
        response = requests.get(
            f"{BASE_URL}/status/{task_id}?withProtocol=true",
            headers=get_headers()
        )
        
        print(f"Status: {response.status_code}")
        data = response.json()
        print(json.dumps(data, indent=2, ensure_ascii=False))
        
        if response.status_code == 200:
            task = data.get('task', {})
            print(f"\n✅ Task status: {task.get('status')}")
            print(f"  Generated: {task.get('generatedCount')}")
            print(f"  Delivered: {task.get('deliveredCount')}")
            print(f"  Failed: {task.get('deliveryFailedCount')}")
            return True
        else:
            print("\n❌ Failed")
            return False
            
    except Exception as e:
        print(f"\n❌ Exception: {e}")
        return False

# ============================================================================
# MAIN
# ============================================================================

def main():
    """Run all tests"""
    print("\n" + "=" * 70)
    print("  ROARING DATA UPDATER API - COMPLETE TEST SUITE")
    print("=" * 70)
    print(f"  Timestamp: {datetime.now().isoformat()}")
    print(f"  Base URL: {BASE_URL}")
    print("=" * 70)
    
    # Step 1: Authenticate
    if not get_access_token():
        print("\n❌ Authentication failed. Exiting.")
        return 1
    
    # Step 2: Run tests
    results = []
    
    results.append(("OAuth2 Authentication", True))
    results.append(("List Services", test_list_services()))
    results.append(("List Webhooks", test_list_webhooks()))
    results.append(("Validate File", test_validate_file()))
    results.append(("List Tasks", test_list_tasks()))
    
    # Start new task
    task_id = test_start_task()
    results.append(("Start Task", task_id is not None))
    
    if task_id:
        print("\n⏳ Waiting 5 seconds before checking status...")
        time.sleep(5)
        results.append(("Task Status", test_task_status(task_id)))
    
    # Summary
    print("\n" + "=" * 70)
    print("  TEST SUMMARY")
    print("=" * 70)
    
    passed = sum(1 for _, result in results if result)
    total = len(results)
    
    for test_name, result in results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"  {status}  {test_name}")
    
    print(f"\n  Total: {passed}/{total} tests passed")
    
    if passed == total:
        print("\n  🎉 All tests passed!")
        return 0
    else:
        print(f"\n  ⚠️  {total - passed} tests failed")
        return 1

if __name__ == "__main__":
    sys.exit(main())
