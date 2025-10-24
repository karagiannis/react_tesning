#!/bin/bash

# Company Information API 2.0 - Comprehensive Test Suite
# ==================================================
# Tests all 3 endpoints with 41 sandbox test cases
# Coverage: AB, EF, partnerships, associations, inactive, PEP, beneficial owners, etc.

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
BASE_URL="https://api.roaring.io"
TOKEN_URL="${BASE_URL}/token"
API_BASE="${BASE_URL}/se/company/overview/2.0"
CLIENT_ID="1fc1c3bb-79d0-4b39-b541-70ef67c810a1"
CLIENT_SECRET="c96cdfe6-84d8-477a-a872-ab93c6e89203"
TEST_RESULTS_DIR="./test_results"

# Create test results directory
mkdir -p "${TEST_RESULTS_DIR}"

# Function to print colored output
print_status() {
    local color=$1
    local message=$2
    echo -e "${color}${message}${NC}"
}

# Function to print test header
print_test_header() {
    local test_number=$1
    local description=$2
    echo ""
    print_status "${BLUE}" "═══════════════════════════════════════════════════════════"
    print_status "${BLUE}" "TEST ${test_number}: ${description}"
    print_status "${BLUE}" "═══════════════════════════════════════════════════════════"
}

# Function to get OAuth2 token
get_access_token() {
    print_status "${YELLOW}" "🔑 Requesting OAuth2 access token..."
    
    local response=$(curl -s -X POST "${TOKEN_URL}" \
        -H "Content-Type: application/x-www-form-urlencoded" \
        -d "grant_type=client_credentials" \
        -d "client_id=${CLIENT_ID}" \
        -d "client_secret=${CLIENT_SECRET}")
    
    local token=$(echo "${response}" | grep -o '"access_token":"[^"]*"' | cut -d'"' -f4)
    
    if [ -z "${token}" ]; then
        print_status "${RED}" "❌ Failed to obtain access token"
        echo "Response: ${response}"
        exit 1
    fi
    
    print_status "${GREEN}" "✅ Access token obtained successfully"
    echo "${token}"
}

# Function to test single company
test_single_company() {
    local company_id=$1
    local description=$2
    local test_num=$3
    local token=$4
    
    print_test_header "${test_num}" "${description} (${company_id})"
    
    local output_file="${TEST_RESULTS_DIR}/co_${company_id}.json"
    local temp_file="/tmp/co_response_${company_id}.json"
    
    print_status "${YELLOW}" "📡 GET ${API_BASE}/${company_id}"
    
    # Use separate files for body and status
    local http_status=$(curl -s -o "${temp_file}" -w "%{http_code}" \
        "${API_BASE}/${company_id}" \
        -H "Authorization: Bearer ${token}" \
        -H "Accept: application/json")
    
    local body=$(cat "${temp_file}")
    
    # Save response
    echo "${body}" | jq '.' > "${output_file}" 2>/dev/null || echo "${body}" > "${output_file}"
    
    if [ "${http_status}" -eq 200 ]; then
        print_status "${GREEN}" "✅ HTTP ${http_status} - Success"
        
        # Extract key fields
        local company_name=$(echo "${body}" | jq -r '.records[0].companyName // "N/A"')
        local status_code=$(echo "${body}" | jq -r '.records[0].statusCode // "N/A"')
        local status_text=$(echo "${body}" | jq -r '.records[0].statusTextDetailed // "N/A"')
        local legal_group=$(echo "${body}" | jq -r '.records[0].legalGroupText // "N/A"')
        local industry=$(echo "${body}" | jq -r '.records[0].industryText // "N/A"')
        local employees=$(echo "${body}" | jq -r '.records[0].numberEmployeesInterval // "N/A"')
        
        print_status "${GREEN}" "   Company: ${company_name}"
        print_status "${GREEN}" "   Status: [${status_code}] ${status_text}"
        print_status "${GREEN}" "   Legal Form: ${legal_group}"
        print_status "${GREEN}" "   Industry: ${industry}"
        print_status "${GREEN}" "   Employees: ${employees}"
        print_status "${GREEN}" "   📁 Saved to: ${output_file}"
        
        return 0
    elif [ "${http_status}" -eq 404 ]; then
        print_status "${YELLOW}" "⚠️  HTTP ${http_status} - Company not found"
        return 1
    else
        print_status "${RED}" "❌ HTTP ${http_status} - Error"
        echo "${body}" | jq '.' 2>/dev/null || echo "${body}"
        return 1
    fi
}

# Function to test batch companies
test_batch_companies() {
    local test_num=$1
    local token=$2
    shift 2
    local company_ids=("$@")
    
    print_test_header "${test_num}" "Batch lookup (${#company_ids[@]} companies)"
    
    local output_file="${TEST_RESULTS_DIR}/co_batch_test.json"
    local temp_file="/tmp/co_batch_response.json"
    
    # Build JSON array
    local ids_json=$(printf '%s\n' "${company_ids[@]}" | jq -R . | jq -s .)
    local request_body=$(jq -n --argjson ids "${ids_json}" '{companyIds: $ids}')
    
    print_status "${YELLOW}" "📡 POST ${API_BASE}/"
    echo "${request_body}" | jq '.'
    
    # Use separate files for body and status
    local http_status=$(curl -s -o "${temp_file}" -w "%{http_code}" \
        -X POST "${API_BASE}/" \
        -H "Authorization: Bearer ${token}" \
        -H "Content-Type: application/json" \
        -H "Accept: application/json" \
        -d "${request_body}")
    
    local body=$(cat "${temp_file}")
    
    # Save response
    echo "${body}" | jq '.' > "${output_file}" 2>/dev/null || echo "${body}" > "${output_file}"
    
    if [ "${http_status}" -eq 200 ]; then
        print_status "${GREEN}" "✅ HTTP ${http_status} - Success"
        
        # Extract batch info
        local request_count=$(echo "${body}" | jq -r '.responseInfo.requestCount // 0')
        local hit_count=$(echo "${body}" | jq -r '.responseInfo.hitCount // 0')
        local no_match=$(echo "${body}" | jq -r '.responseInfo.noMatchIds | length // 0')
        
        print_status "${GREEN}" "   Requested: ${request_count} companies"
        print_status "${GREEN}" "   Found: ${hit_count} companies"
        print_status "${GREEN}" "   Not found: ${no_match} companies"
        
        if [ "${no_match}" -gt 0 ]; then
            local no_match_ids=$(echo "${body}" | jq -r '.responseInfo.noMatchIds[]')
            print_status "${YELLOW}" "   Missing IDs: ${no_match_ids}"
        fi
        
        print_status "${GREEN}" "   📁 Saved to: ${output_file}"
        return 0
    else
        print_status "${RED}" "❌ HTTP ${http_status} - Error"
        echo "${body}" | jq '.' 2>/dev/null || echo "${body}"
        return 1
    fi
}

# Function to test history endpoint
test_history() {
    local company_id=$1
    local from_date=$2
    local to_date=$3
    local description=$4
    local test_num=$5
    local token=$6
    
    print_test_header "${test_num}" "${description} (${company_id})"
    
    local output_file="${TEST_RESULTS_DIR}/co_history_${company_id}.json"
    local temp_file="/tmp/co_history_${company_id}.json"
    local url="${API_BASE}/history/${company_id}?fromDate=${from_date}"
    
    if [ -n "${to_date}" ]; then
        url="${url}&toDate=${to_date}"
    fi
    
    print_status "${YELLOW}" "📡 GET ${url}"
    
    # Use separate files for body and status
    local http_status=$(curl -s -o "${temp_file}" -w "%{http_code}" \
        "${url}" \
        -H "Authorization: Bearer ${token}" \
        -H "Accept: application/json")
    
    local body=$(cat "${temp_file}")
    
    # Save response
    echo "${body}" | jq '.' > "${output_file}" 2>/dev/null || echo "${body}" > "${output_file}"
    
    if [ "${http_status}" -eq 200 ]; then
        print_status "${GREEN}" "✅ HTTP ${http_status} - Success"
        
        # Count historical records
        local record_count=$(echo "${body}" | jq '.records | length // 0')
        
        print_status "${GREEN}" "   Historical records: ${record_count}"
        
        if [ "${record_count}" -gt 0 ]; then
            # Show first and last change dates
            local first_date=$(echo "${body}" | jq -r '.records[0].changeDate // "N/A"')
            local last_date=$(echo "${body}" | jq -r ".records[$((record_count-1))].changeDate // \"N/A\"")
            
            print_status "${GREEN}" "   First change: ${first_date}"
            print_status "${GREEN}" "   Last change: ${last_date}"
        fi
        
        print_status "${GREEN}" "   📁 Saved to: ${output_file}"
        return 0
    else
        print_status "${RED}" "❌ HTTP ${http_status} - Error"
        echo "${body}" | jq '.' 2>/dev/null || echo "${body}"
        return 1
    fi
}

# Main test execution
main() {
    print_status "${BLUE}" "╔═══════════════════════════════════════════════════════════╗"
    print_status "${BLUE}" "║   Company Information API 2.0 - Test Suite               ║"
    print_status "${BLUE}" "║   Roaring.io Sandbox Environment                         ║"
    print_status "${BLUE}" "╚═══════════════════════════════════════════════════════════╝"
    echo ""
    
    # Check dependencies
    command -v curl >/dev/null 2>&1 || { print_status "${RED}" "❌ curl is required but not installed."; exit 1; }
    command -v jq >/dev/null 2>&1 || { print_status "${RED}" "❌ jq is required but not installed."; exit 1; }
    
    # Get access token
    ACCESS_TOKEN=$(get_access_token)
    
    # Test counters
    local total_tests=0
    local passed_tests=0
    local failed_tests=0
    
    # ======================
    # CATEGORY 1: AKTIEBOLAG (AB) - 15 tests
    # ======================
    
    print_status "${YELLOW}" "\n🏢 CATEGORY 1: AKTIEBOLAG (AB) - 15 tests"
    
    test_single_company "5560572850" "Standard AB - Privat aktiebolag" 1 "${ACCESS_TOKEN}" && ((passed_tests++)) || ((failed_tests++))
    ((total_tests++))
    
    test_single_company "5569768681" "AB Konkurs avslutad" 2 "${ACCESS_TOKEN}" && ((passed_tests++)) || ((failed_tests++))
    ((total_tests++))
    
    test_single_company "5566808134" "Inactive AB" 3 "${ACCESS_TOKEN}" && ((passed_tests++)) || ((failed_tests++))
    ((total_tests++))
    
    test_single_company "5590523865" "AB with Alternative Beneficial Owner" 4 "${ACCESS_TOKEN}" && ((passed_tests++)) || ((failed_tests++))
    ((total_tests++))
    
    test_single_company "5565002465" "AB with Top Director (1)" 5 "${ACCESS_TOKEN}" && ((passed_tests++)) || ((failed_tests++))
    ((total_tests++))
    
    test_single_company "5590170733" "AB with Top Director (2)" 6 "${ACCESS_TOKEN}" && ((passed_tests++)) || ((failed_tests++))
    ((total_tests++))
    
    test_single_company "5564866803" "AB with Top Director (3)" 7 "${ACCESS_TOKEN}" && ((passed_tests++)) || ((failed_tests++))
    ((total_tests++))
    
    test_single_company "5564881422" "AB with Top Director (4)" 8 "${ACCESS_TOKEN}" && ((passed_tests++)) || ((failed_tests++))
    ((total_tests++))
    
    test_single_company "5568202559" "AB with Signing Combination" 9 "${ACCESS_TOKEN}" && ((passed_tests++)) || ((failed_tests++))
    ((total_tests++))
    
    test_single_company "5592554108" "AB with 2 Linked Establishments" 10 "${ACCESS_TOKEN}" && ((passed_tests++)) || ((failed_tests++))
    ((total_tests++))
    
    test_single_company "5565926911" "Storbolaget AB" 11 "${ACCESS_TOKEN}" && ((passed_tests++)) || ((failed_tests++))
    ((total_tests++))
    
    test_single_company "5569030264" "Standard AB (2)" 12 "${ACCESS_TOKEN}" && ((passed_tests++)) || ((failed_tests++))
    ((total_tests++))
    
    test_single_company "5569994600" "Standard AB (3)" 13 "${ACCESS_TOKEN}" && ((passed_tests++)) || ((failed_tests++))
    ((total_tests++))
    
    test_single_company "5564779444" "Standard AB (4)" 14 "${ACCESS_TOKEN}" && ((passed_tests++)) || ((failed_tests++))
    ((total_tests++))
    
    test_single_company "5567164818" "Standard AB (5)" 15 "${ACCESS_TOKEN}" && ((passed_tests++)) || ((failed_tests++))
    ((total_tests++))
    
    # ======================
    # CATEGORY 2: ENSKILD FIRMA (EF) - 14 tests
    # ======================
    
    print_status "${YELLOW}" "\n👤 CATEGORY 2: ENSKILD FIRMA (EF) - 14 tests"
    
    test_single_company "5401109565" "EF - Standard (1)" 16 "${ACCESS_TOKEN}" && ((passed_tests++)) || ((failed_tests++))
    ((total_tests++))
    
    test_single_company "8904062380" "EF - Standard (2)" 17 "${ACCESS_TOKEN}" && ((passed_tests++)) || ((failed_tests++))
    ((total_tests++))
    
    test_single_company "5007312589" "EF - Standard (3)" 18 "${ACCESS_TOKEN}" && ((passed_tests++)) || ((failed_tests++))
    ((total_tests++))
    
    test_single_company "6709192642" "EF - Standard (4)" 19 "${ACCESS_TOKEN}" && ((passed_tests++)) || ((failed_tests++))
    ((total_tests++))
    
    test_single_company "5711092642" "EF - Standard (5)" 20 "${ACCESS_TOKEN}" && ((passed_tests++)) || ((failed_tests++))
    ((total_tests++))
    
    test_single_company "7904182396" "EF - Standard (6)" 21 "${ACCESS_TOKEN}" && ((passed_tests++)) || ((failed_tests++))
    ((total_tests++))
    
    test_single_company "6501133372" "EF - Standard (7)" 22 "${ACCESS_TOKEN}" && ((passed_tests++)) || ((failed_tests++))
    ((total_tests++))
    
    test_single_company "7706082398" "EF - Standard (8)" 23 "${ACCESS_TOKEN}" && ((passed_tests++)) || ((failed_tests++))
    ((total_tests++))
    
    test_single_company "5809132896" "EF - Standard (9)" 24 "${ACCESS_TOKEN}" && ((passed_tests++)) || ((failed_tests++))
    ((total_tests++))
    
    test_single_company "6805029268" "EF - Inactive" 25 "${ACCESS_TOKEN}" && ((passed_tests++)) || ((failed_tests++))
    ((total_tests++))
    
    test_single_company "8809032397" "EF - Connected to PEP (non-secrecy)" 26 "${ACCESS_TOKEN}" && ((passed_tests++)) || ((failed_tests++))
    ((total_tests++))
    
    test_single_company "8409022384" "EF - Person with AB engagements (1)" 27 "${ACCESS_TOKEN}" && ((passed_tests++)) || ((failed_tests++))
    ((total_tests++))
    
    test_single_company "7602172392" "EF - Person with AB engagements (2)" 28 "${ACCESS_TOKEN}" && ((passed_tests++)) || ((failed_tests++))
    ((total_tests++))
    
    test_single_company "8110022392" "EF - Person with AB engagements (3)" 29 "${ACCESS_TOKEN}" && ((passed_tests++)) || ((failed_tests++))
    ((total_tests++))
    
    # ======================
    # CATEGORY 3: AB WITH EF CONNECTION
    # ======================
    
    print_status "${YELLOW}" "\n🔗 CATEGORY 3: AB WITH EF CONNECTION - 1 test"
    
    test_single_company "5591316244" "AB with engagement to person with EF" 30 "${ACCESS_TOKEN}" && ((passed_tests++)) || ((failed_tests++))
    ((total_tests++))
    
    # ======================
    # CATEGORY 4: PARTNERSHIPS - 2 tests
    # ======================
    
    print_status "${YELLOW}" "\n🤝 CATEGORY 4: PARTNERSHIPS - 2 tests"
    
    test_single_company "9168937861" "Limited Partnership (Kommanditbolag)" 31 "${ACCESS_TOKEN}" && ((passed_tests++)) || ((failed_tests++))
    ((total_tests++))
    
    test_single_company "9697715770" "General Partnership (Handelsbolag)" 32 "${ACCESS_TOKEN}" && ((passed_tests++)) || ((failed_tests++))
    ((total_tests++))
    
    # ======================
    # CATEGORY 5: ASSOCIATIONS & FOUNDATIONS - 6 tests
    # ======================
    
    print_status "${YELLOW}" "\n🏛️  CATEGORY 5: ASSOCIATIONS & FOUNDATIONS - 6 tests"
    
    test_single_company "8430025331" "Non-profit Association - Ideell förening GÅRDEN" 33 "${ACCESS_TOKEN}" && ((passed_tests++)) || ((failed_tests++))
    ((total_tests++))
    
    test_single_company "8394004322" "Non-profit Association - Ideell förening" 34 "${ACCESS_TOKEN}" && ((passed_tests++)) || ((failed_tests++))
    ((total_tests++))
    
    test_single_company "7696053631" "Housing Association - Bostadsförening" 35 "${ACCESS_TOKEN}" && ((passed_tests++)) || ((failed_tests++))
    ((total_tests++))
    
    test_single_company "7179135202" "Community Association - Samfällighet" 36 "${ACCESS_TOKEN}" && ((passed_tests++)) || ((failed_tests++))
    ((total_tests++))
    
    test_single_company "8024045489" "Foundation - Stiftelse/Fond" 37 "${ACCESS_TOKEN}" && ((passed_tests++)) || ((failed_tests++))
    ((total_tests++))
    
    test_single_company "8020028638" "Humanitarian Aid Organization" 38 "${ACCESS_TOKEN}" && ((passed_tests++)) || ((failed_tests++))
    ((total_tests++))
    
    # ======================
    # CATEGORY 6: FOREIGN BRANCH
    # ======================
    
    print_status "${YELLOW}" "\n🌍 CATEGORY 6: FOREIGN BRANCH - 1 test"
    
    test_single_company "5164010133" "Branch to Foreign Company - Utländsk Banks Filial" 39 "${ACCESS_TOKEN}" && ((passed_tests++)) || ((failed_tests++))
    ((total_tests++))
    
    # ======================
    # CATEGORY 7: TEST/DEMO
    # ======================
    
    print_status "${YELLOW}" "\n🧪 CATEGORY 7: TEST/DEMO - 1 test"
    
    test_single_company "5590672613" "Company Test" 40 "${ACCESS_TOKEN}" && ((passed_tests++)) || ((failed_tests++))
    ((total_tests++))
    
    # ======================
    # CATEGORY 8: HISTORY ENDPOINT - 2 tests
    # ======================
    
    print_status "${YELLOW}" "\n📜 CATEGORY 8: HISTORY ENDPOINT - 2 tests"
    
    test_history "5569030264" "2016-12-11" "2018-02-21" "Limited liability company - Historical changes" 41 "${ACCESS_TOKEN}" && ((passed_tests++)) || ((failed_tests++))
    ((total_tests++))
    
    test_history "5560021361" "2020-06-03" "" "Company which changed name" 42 "${ACCESS_TOKEN}" && ((passed_tests++)) || ((failed_tests++))
    ((total_tests++))
    
    # ======================
    # CATEGORY 9: BATCH ENDPOINT - 1 test
    # ======================
    
    print_status "${YELLOW}" "\n📦 CATEGORY 9: BATCH ENDPOINT - 1 test"
    
    # Test batch with mix of valid and invalid IDs
    test_batch_companies 43 "${ACCESS_TOKEN}" \
        "5560572850" \
        "5569768681" \
        "5566808134" \
        "5401109565" \
        "9999999999" && ((passed_tests++)) || ((failed_tests++))
    ((total_tests++))
    
    # ======================
    # FINAL SUMMARY
    # ======================
    
    echo ""
    print_status "${BLUE}" "╔═══════════════════════════════════════════════════════════╗"
    print_status "${BLUE}" "║                     TEST SUMMARY                          ║"
    print_status "${BLUE}" "╚═══════════════════════════════════════════════════════════╝"
    echo ""
    print_status "${BLUE}" "Total Tests:  ${total_tests}"
    print_status "${GREEN}" "Passed:       ${passed_tests}"
    print_status "${RED}" "Failed:       ${failed_tests}"
    echo ""
    
    local success_rate=$(awk "BEGIN {printf \"%.1f\", (${passed_tests}/${total_tests})*100}")
    print_status "${BLUE}" "Success Rate: ${success_rate}%"
    echo ""
    
    print_status "${BLUE}" "📁 All test results saved to: ${TEST_RESULTS_DIR}/"
    echo ""
    
    if [ ${failed_tests} -eq 0 ]; then
        print_status "${GREEN}" "✅ ALL TESTS PASSED!"
        exit 0
    else
        print_status "${YELLOW}" "⚠️  Some tests failed. Check results above."
        exit 1
    fi
}

# Run main function
main
