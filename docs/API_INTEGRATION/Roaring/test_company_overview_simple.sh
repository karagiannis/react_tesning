#!/bin/bash

# Company Information API 2.0 - Simple Test Script
# Tests a few key companies to verify API understanding

# Get token
echo "🔑 Getting OAuth2 token..."
TOKEN=$(curl -s -X POST "https://api.roaring.io/token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=client_credentials&client_id=1fc1c3bb-79d0-4b39-b541-70ef67c810a1&client_secret=c96cdfe6-84d8-477a-a872-ab93c6e89203" \
  | jq -r '.access_token')

if [ -z "$TOKEN" ]; then
  echo "❌ Failed to get token"
  exit 1
fi

echo "✅ Token obtained: ${TOKEN:0:10}..."
echo ""

mkdir -p ./test_results

# Test function
test_company() {
  local id=$1
  local desc=$2
  
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "📋 TEST: $desc ($id)"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  
  HTTP_CODE=$(curl -s -o "./test_results/co_$id.json" -w "%{http_code}" \
    "https://api.roaring.io/se/company/overview/2.0/$id" \
    -H "Authorization: Bearer $TOKEN")
  
  if [ "$HTTP_CODE" = "200" ]; then
    echo "✅ HTTP $HTTP_CODE - Success"
    
    # Extract and display key info
    cat "./test_results/co_$id.json" | jq -r '
      .records[0] | 
      "   Company: \(.companyName)
   Status: [\(.statusCode)] \(.statusTextDetailed)
   Legal Form: \(.legalGroupText)
   Industry: \(.industryText // "N/A")
   Employees: \(.numberEmployeesInterval // "N/A")
   VAT: \(if .vatReg then "✓ Yes" else "✗ No" end)
   F-skatt: \(if .preliminaryTaxReg then "✓ Yes" else "✗ No" end)"
    '
    echo ""
    return 0
  else
    echo "❌ HTTP $HTTP_CODE - Failed"
    cat "./test_results/co_$id.json"
    echo ""
    return 1
  fi
}

echo "╔═══════════════════════════════════════════════════════════╗"
echo "║   Company Information API 2.0 - Quick Test               ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo ""

passed=0
failed=0
total_tests=10

# Test 1: Standard AB
if test_company "5560572850" "Standard AB - Privat aktiebolag"; then ((passed++)); else ((failed++)); fi

# Test 2: AB Konkurs avslutad
if test_company "5569768681" "AB Konkurs avslutad"; then ((passed++)); else ((failed++)); fi

# Test 3: Enskild Firma
if test_company "5401109565" "Enskild Firma"; then ((passed++)); else ((failed++)); fi

# Test 4: Inactive company
if test_company "5566808134" "Inactive Company"; then ((passed++)); else ((failed++)); fi

# Test 5: EF med PEP connection
if test_company "8809032397" "EF connected to PEP"; then ((passed++)); else ((failed++)); fi

# Test 6: Kommanditbolag
if test_company "9168937861" "Limited Partnership (KB)"; then ((passed++)); else ((failed++)); fi

# Test 7: Ideell förening
if test_company "8430025331" "Non-profit Association"; then ((passed++)); else ((failed++)); fi

# Test 8: Utländsk filial
if test_company "5164010133" "Foreign Branch"; then ((passed++)); else ((failed++)); fi

# Test 9: History endpoint
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📋 TEST: History - Company name change (5560021361)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

HTTP_CODE=$(curl -s -o "./test_results/co_history_5560021361.json" -w "%{http_code}" \
  "https://api.roaring.io/se/company/overview/2.0/history/5560021361?fromDate=2020-06-03" \
  -H "Authorization: Bearer $TOKEN")

if [ "$HTTP_CODE" = "200" ]; then
  echo "✅ HTTP $HTTP_CODE - Success"
  RECORD_COUNT=$(cat "./test_results/co_history_5560021361.json" | jq '.records | length')
  echo "   Historical records: $RECORD_COUNT"
  
  if [ "$RECORD_COUNT" -gt 0 ]; then
    echo "   Changes detected:"
    cat "./test_results/co_history_5560021361.json" | jq -r '.records[] | "   - \(.changeDate): \(.companyName)"'
  fi
  echo ""
  passed=$((passed + 1))
else
  echo "❌ HTTP $HTTP_CODE - Failed"
  failed=$((failed + 1))
fi

# Test 10: Batch endpoint
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📋 TEST: Batch lookup (3 companies)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

HTTP_CODE=$(curl -L -s -o "./test_results/co_batch.json" -w "%{http_code}" \
  -X POST "https://api.roaring.io/se/company/overview/2.0/" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"companyIds":["5560572850","5569768681","9999999999"]}')

if [ "$HTTP_CODE" = "200" ]; then
  echo "✅ HTTP $HTTP_CODE - Success"
  cat "./test_results/co_batch.json" | jq -r '
    .responseInfo | 
    "   Requested: \(.requestCount)
   Found: \(.hitCount)
   Not found: \(.noMatchIds | length)
   Missing IDs: \(.noMatchIds | join(", "))"
  '
  echo ""
  passed=$((passed + 1))
else
  echo "❌ HTTP $HTTP_CODE - Failed"
  failed=$((failed + 1))
fi

# Summary
echo "╔═══════════════════════════════════════════════════════════╗"
echo "║                     TEST SUMMARY                          ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo ""
echo "Total:  $total_tests tests"
echo "Passed: $passed ✅"
echo "Failed: $failed"
echo ""

if [ $failed -eq 0 ]; then
  echo "✅ ALL TESTS PASSED!"
  echo ""
  echo "📁 Test results saved to: ./test_results/"
  echo ""
  exit 0
else
  echo "⚠️  $failed test(s) failed"
  exit 1
fi
