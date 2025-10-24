#!/usr/bin/env python3
"""
Test script for Roaring Data Updater (Webhook) API

Tests:
1. Lista tillgängliga services
2. Lista webhooks
3. Validera fil med org.nr
4. Starta övervakningsuppgift
5. Lista aktiva tasks
6. Hämta status på specifik task

Usage:
    python3 test_data_updater.py

Requirements:
    pip3 install requests
"""

import requests
import json
import time
import sys
from datetime import datetime

# ============================================================================
# CONFIGURATION
# ============================================================================

BASE_URL = "https://api.roaring.io/se/company/current-information/1.0"

# TODO: Replace with your actual access token
ACCESS_TOKEN = "your_access_token_here"

# TODO: Replace with your webhook ID from Roaring portal
WEBHOOK_ID = "webhook-test-123"

# Test company (Perfect Company)
TEST_COMPANY_ID = "5564881422"

# ============================================================================
# HELPER FUNCTIONS
# ============================================================================

def get_headers():
    """Return standard headers for API requests"""
    return {
        "Authorization": f"Bearer {ACCESS_TOKEN}",
        "Accept": "application/json",
        "Content-Type": "application/json"
    }

def print_section(title):
    """Print formatted section header"""
    print("\n" + "=" * 70)
    print(f"  {title}")
    print("=" * 70)

def print_response(response):
    """Print response status and pretty JSON"""
    print(f"\nHTTP Status: {response.status_code}")
    try:
        data = response.json()
        print(json.dumps(data, indent=2, ensure_ascii=False))
        return data
    except:
        print(f"Response text: {response.text}")
        return None

# ============================================================================
# TEST FUNCTIONS
# ============================================================================

def test_list_services():
    """Test 1: Lista tillgängliga services"""
    print_section("TEST 1: Lista tillgängliga services")
    print("Endpoint: GET /services")
    
    try:
        response = requests.get(
            f"{BASE_URL}/services",
            headers=get_headers()
        )
        
        data = print_response(response)
        
        if response.status_code == 200 and data:
            services = data.get('services', [])
            print(f"\n✅ Hittade {len(services)} services:")
            for service in services:
                name = service.get('name', 'N/A')
                display = service.get('displayName', 'N/A')
                desc = service.get('description', 'N/A')
                print(f"  • {name}")
                print(f"    Display: {display}")
                print(f"    Beskrivning: {desc}")
            return True
        else:
            print("\n❌ Misslyckades att hämta services")
            return False
            
    except Exception as e:
        print(f"\n❌ Exception: {e}")
        return False

def test_list_webhooks():
    """Test 2: Lista webhooks"""
    print_section("TEST 2: Lista webhooks")
    print("Endpoint: GET /webhooks")
    
    try:
        response = requests.get(
            f"{BASE_URL}/webhooks",
            headers=get_headers()
        )
        
        data = print_response(response)
        
        if response.status_code == 200 and data:
            webhooks = data.get('webhooks', [])
            print(f"\n✅ Hittade {len(webhooks)} webhooks:")
            for wh in webhooks:
                wh_id = wh.get('id', 'N/A')
                url = wh.get('url', 'N/A')
                active = wh.get('active', False)
                status_icon = "🟢" if active else "🔴"
                print(f"  {status_icon} {wh_id}")
                print(f"     URL: {url}")
                print(f"     Active: {active}")
            return True
        else:
            print("\n❌ Misslyckades att hämta webhooks")
            return False
            
    except Exception as e:
        print(f"\n❌ Exception: {e}")
        return False

def test_validate_file():
    """Test 3: Validera fil med org.nr"""
    print_section("TEST 3: Validera fil med org.nr")
    print("Endpoint: PUT /validate")
    
    # Skapa testfil med både giltiga och ogiltiga org.nr
    test_file_path = '/tmp/test_orgnr_roaring.txt'
    test_content = """5564881422
5590523865
556INVALID
5569876543
55640-1234
5512345678"""
    
    print(f"\nSkapar testfil: {test_file_path}")
    print("Innehåll:")
    for i, line in enumerate(test_content.split('\n'), 1):
        print(f"  {i}. {line}")
    
    try:
        with open(test_file_path, 'w') as f:
            f.write(test_content)
        
        # Ladda upp för validering
        with open(test_file_path, 'rb') as f:
            files = {'file': ('test_orgnr.txt', f, 'text/plain')}
            response = requests.put(
                f"{BASE_URL}/validate",
                headers={"Authorization": f"Bearer {ACCESS_TOKEN}"},
                files=files
            )
        
        data = print_response(response)
        
        if response.status_code == 200 and data:
            valid = data.get('valid', False)
            good = data.get('goodIdsQuantity', 0)
            bad = data.get('badIdsQuantity', 0)
            message = data.get('validationMessage', '')
            
            if valid:
                print(f"\n✅ Filen är valid!")
            else:
                print(f"\n⚠️ Filen innehåller fel!")
            
            print(f"  Giltiga org.nr: {good}")
            print(f"  Ogiltiga org.nr: {bad}")
            if message:
                print(f"  Meddelande: {message}")
            
            return True
        else:
            print("\n❌ Misslyckades att validera fil")
            return False
            
    except Exception as e:
        print(f"\n❌ Exception: {e}")
        return False

def test_start_task():
    """Test 4: Starta övervakningsuppgift"""
    print_section("TEST 4: Starta övervakningsuppgift")
    print(f"Endpoint: PUT /start/{WEBHOOK_ID}")
    
    payload = {
        "companyIds": [TEST_COMPANY_ID],
        "services": ["BOARD_MEMBERS", "BENEFICIAL_OWNER", "ADDRESS_CHANGE"]
    }
    
    print(f"\nRequest payload:")
    print(json.dumps(payload, indent=2))
    
    try:
        response = requests.put(
            f"{BASE_URL}/start/{WEBHOOK_ID}",
            headers=get_headers(),
            json=payload
        )
        
        data = print_response(response)
        
        if response.status_code == 200 and data:
            task = data.get('task', {})
            task_id = task.get('id')
            
            print(f"\n✅ Task skapad framgångsrikt!")
            print(f"  Task ID: {task_id}")
            print(f"  Webhook ID: {task.get('webhookId')}")
            print(f"  Antal företag: {task.get('companyIdsCount')}")
            print(f"  Services: {', '.join(task.get('services', []))}")
            print(f"  Status: {task.get('status')}")
            print(f"  Startad: {task.get('startedAt')}")
            
            return task_id
        else:
            print("\n❌ Misslyckades att starta task")
            return None
            
    except Exception as e:
        print(f"\n❌ Exception: {e}")
        return None

def test_list_tasks():
    """Test 5: Lista aktiva tasks"""
    print_section("TEST 5: Lista aktiva tasks")
    print("Endpoint: GET /tasks")
    
    try:
        response = requests.get(
            f"{BASE_URL}/tasks",
            headers=get_headers()
        )
        
        data = print_response(response)
        
        if response.status_code == 200 and data:
            tasks = data.get('tasks', [])
            print(f"\n✅ Hittade {len(tasks)} tasks:")
            
            for task in tasks:
                task_id = task.get('id', 'N/A')
                status = task.get('status', 'N/A')
                company_count = task.get('companyIdsCount', 0)
                generated = task.get('generatedCount', 0)
                delivered = task.get('deliveredCount', 0)
                failed = task.get('deliveryFailedCount', 0)
                
                status_icon = "🟢" if status == "active" else "⚪"
                
                print(f"\n  {status_icon} Task: {task_id}")
                print(f"     Status: {status}")
                print(f"     Företag: {company_count}")
                print(f"     Events generated: {generated}")
                print(f"     Events delivered: {delivered}")
                print(f"     Events failed: {failed}")
            
            return True
        else:
            print("\n❌ Misslyckades att hämta tasks")
            return False
            
    except Exception as e:
        print(f"\n❌ Exception: {e}")
        return False

def test_task_status(task_id):
    """Test 6: Hämta status på specifik task"""
    print_section(f"TEST 6: Task status för {task_id}")
    print(f"Endpoint: GET /status/{task_id}?withProtocol=true")
    
    try:
        response = requests.get(
            f"{BASE_URL}/status/{task_id}?withProtocol=true",
            headers=get_headers()
        )
        
        data = print_response(response)
        
        if response.status_code == 200 and data:
            task = data.get('task', {})
            protocol = data.get('protocol', {})
            
            print(f"\n✅ Task status:")
            print(f"  Status: {task.get('status')}")
            print(f"  Startad: {task.get('startedAt')}")
            print(f"  Senast ändrad: {task.get('lastModifiedAt')}")
            print(f"  Avslutad: {task.get('completedAt') or 'Ej avslutad'}")
            
            print(f"\n  Statistik:")
            print(f"    Generated: {task.get('generatedCount')}")
            print(f"    Delivered: {task.get('deliveredCount')}")
            print(f"    Failed: {task.get('deliveryFailedCount')}")
            print(f"    Not found: {task.get('notFoundCount')}")
            print(f"    Validation failed: {task.get('validationFailedCount')}")
            
            if protocol and 'services' in protocol:
                print(f"\n  Protokoll per service:")
                for svc in protocol['services']:
                    svc_name = svc.get('serviceName')
                    gen = svc.get('eventsGenerated', 0)
                    deliv = svc.get('eventsDelivered', 0)
                    fail = svc.get('eventsFailed', 0)
                    
                    print(f"    • {svc_name}")
                    print(f"      Generated: {gen}, Delivered: {deliv}, Failed: {fail}")
            
            return True
        else:
            print("\n❌ Misslyckades att hämta task status")
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
    print("  ROARING DATA UPDATER (WEBHOOK) API TEST")
    print("=" * 70)
    print(f"  Timestamp: {datetime.now().isoformat()}")
    print(f"  Base URL: {BASE_URL}")
    print(f"  Webhook ID: {WEBHOOK_ID}")
    print(f"  Test Company: {TEST_COMPANY_ID}")
    print("=" * 70)
    
    # Check configuration
    if ACCESS_TOKEN == "your_access_token_here":
        print("\n❌ ERROR: Please set ACCESS_TOKEN in the script")
        sys.exit(1)
    
    if WEBHOOK_ID == "webhook-test-123":
        print("\n⚠️  WARNING: Using default WEBHOOK_ID. Please update if needed.")
    
    # Run tests
    results = []
    
    results.append(("Lista services", test_list_services()))
    results.append(("Lista webhooks", test_list_webhooks()))
    results.append(("Validera fil", test_validate_file()))
    results.append(("Lista tasks", test_list_tasks()))
    
    # Start new task
    task_id = test_start_task()
    results.append(("Starta task", task_id is not None))
    
    if task_id:
        # Wait before checking status
        print("\n⏳ Väntar 5 sekunder innan status-check...")
        time.sleep(5)
        
        results.append(("Task status", test_task_status(task_id)))
    
    # Summary
    print_section("SAMMANFATTNING")
    
    passed = sum(1 for _, result in results if result)
    total = len(results)
    
    for test_name, result in results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"  {status}  {test_name}")
    
    print(f"\n  Total: {passed}/{total} tester godkända")
    
    if passed == total:
        print("\n  🎉 Alla tester godkända!")
        return 0
    else:
        print(f"\n  ⚠️  {total - passed} tester misslyckades")
        return 1

if __name__ == "__main__":
    sys.exit(main())
