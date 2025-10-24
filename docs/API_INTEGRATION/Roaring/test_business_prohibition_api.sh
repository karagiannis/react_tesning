#!/bin/bash

# Business Prohibition API Test Script
# Tests all sandbox personnummer to verify understanding

set -e  # Exit on error

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Business Prohibition API - Live Tests${NC}"
echo -e "${BLUE}========================================${NC}\n"

# Create test results directory
mkdir -p test_results

# Step 1: Get OAuth2 token
echo -e "${YELLOW}[1/8] Getting OAuth2 token...${NC}"
TOKEN_RESPONSE=$(curl -s -X POST https://api.roaring.io/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=client_credentials" \
  -d "client_id=1fc1c3bb-79d0-4b39-b541-70ef67c810a1" \
  -d "client_secret=c96cdfe6-84d8-477a-a872-ab93c6e89203")

ACCESS_TOKEN=$(echo $TOKEN_RESPONSE | jq -r '.access_token')

if [ "$ACCESS_TOKEN" == "null" ] || [ -z "$ACCESS_TOKEN" ]; then
  echo -e "${RED}❌ Failed to get access token${NC}"
  echo $TOKEN_RESPONSE | jq .
  exit 1
fi

echo -e "${GREEN}✅ Token acquired: ${ACCESS_TOKEN:0:20}...${NC}\n"

# Base URL
BASE_URL="https://api.roaring.io/se/businessprohibition/1.0"

# Test 2: Person WITHOUT prohibition (clean check)
echo -e "${YELLOW}[2/8] Testing person WITHOUT business prohibition...${NC}"
echo -e "       Personnummer: 198604069883"
curl -s -X GET "$BASE_URL/person/198604069883" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Accept: application/json" | jq . > test_results/bp_no_prohibition.json

RECORDS_COUNT=$(cat test_results/bp_no_prohibition.json | jq '.records | length')
echo -e "${GREEN}✅ Response saved. Records found: $RECORDS_COUNT${NC}"
echo -e "   Expected: 0 records (clean person)"
cat test_results/bp_no_prohibition.json | jq '.status'
echo ""

# Test 3: Business prohibition WITH temporary prohibition
echo -e "${YELLOW}[3/8] Testing person WITH temporary prohibition...${NC}"
echo -e "       Personnummer: 198503302393"
curl -s -X GET "$BASE_URL/person/198503302393" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Accept: application/json" | jq . > test_results/bp_temporary_prohibition.json

RECORDS_COUNT=$(cat test_results/bp_temporary_prohibition.json | jq '.records | length')
echo -e "${GREEN}✅ Response saved. Records found: $RECORDS_COUNT${NC}"
echo -e "   Expected: Has temporaryProhibitionDecisionDate + temporaryProhibitionMonitoringDate"
cat test_results/bp_temporary_prohibition.json | jq '.records[0] | {temporaryProhibitionDecisionDate, temporaryProhibitionMonitoringDate}'
echo ""

# Test 4: Jan Efternamn 2584 (standard test)
echo -e "${YELLOW}[4/8] Testing Jan Efternamn 2584...${NC}"
echo -e "       Personnummer: 198001139297"
curl -s -X GET "$BASE_URL/person/198001139297" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Accept: application/json" | jq . > test_results/bp_jan_efternamn.json

RECORDS_COUNT=$(cat test_results/bp_jan_efternamn.json | jq '.records | length')
echo -e "${GREEN}✅ Response saved. Records found: $RECORDS_COUNT${NC}"
cat test_results/bp_jan_efternamn.json | jq '.records[0].name // .status'
echo ""

# Test 5: Business prohibition WITH exemption (dispens)
echo -e "${YELLOW}[5/8] Testing person WITH exemption info...${NC}"
echo -e "       Personnummer: 192908187541"
curl -s -X GET "$BASE_URL/person/192908187541" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Accept: application/json" | jq . > test_results/bp_exemption.json

RECORDS_COUNT=$(cat test_results/bp_exemption.json | jq '.records | length')
echo -e "${GREEN}✅ Response saved. Records found: $RECORDS_COUNT${NC}"
echo -e "   Expected: Has exemptionFromDate/ToDate + freeText"
cat test_results/bp_exemption.json | jq '.records[0] | {exemptionFromDate, exemptionToDate, exemptionRevocationDate, freeText}'
echo ""

# Test 6: Business prohibition WITH C/O address
echo -e "${YELLOW}[6/8] Testing person WITH C/O address...${NC}"
echo -e "       Personnummer: 198208272396"
curl -s -X GET "$BASE_URL/person/198208272396" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Accept: application/json" | jq . > test_results/bp_co_address.json

RECORDS_COUNT=$(cat test_results/bp_co_address.json | jq '.records | length')
echo -e "${GREEN}✅ Response saved. Records found: $RECORDS_COUNT${NC}"
echo -e "   Expected: Has coAddress in addressInformation"
cat test_results/bp_co_address.json | jq '.records[0].addressInformation'
echo ""

# Test 7: Business prohibition WITH foreign address
echo -e "${YELLOW}[7/8] Testing person WITH foreign address...${NC}"
echo -e "       Personnummer: 194812161596"
curl -s -X GET "$BASE_URL/person/194812161596" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Accept: application/json" | jq . > test_results/bp_foreign_address.json

RECORDS_COUNT=$(cat test_results/bp_foreign_address.json | jq '.records | length')
echo -e "${GREEN}✅ Response saved. Records found: $RECORDS_COUNT${NC}"
echo -e "   Expected: Country != Sverige"
cat test_results/bp_foreign_address.json | jq '.records[0].addressInformation | {country, countryCode}'
echo ""

# Test 8: Company endpoint with test company
echo -e "${YELLOW}[8/8] Testing company endpoint...${NC}"
echo -e "       Company ID: 556903-8671"
echo -e "       relationsHistoryYears: 2 (default)"
curl -s -X GET "$BASE_URL/company/556903-8671?relationsHistoryYears=2" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Accept: application/json" | jq . > test_results/bp_company.json

RECORDS_COUNT=$(cat test_results/bp_company.json | jq '.records | length')
echo -e "${GREEN}✅ Response saved. Records found: $RECORDS_COUNT${NC}"
cat test_results/bp_company.json | jq '.status'
echo ""

echo -e "${BLUE}========================================${NC}"
echo -e "${GREEN}✅ All tests completed!${NC}"
echo -e "${BLUE}========================================${NC}"
echo -e "\nResults saved in: test_results/bp_*.json"
echo -e "\nKey findings to verify:"
echo -e "  • 198604069883: Should have 0 records (clean)"
echo -e "  • 198503302393: Should have temporaryProhibition dates"
echo -e "  • 192908187541: Should have exemption dates + freeText"
echo -e "  • 198208272396: Should have coAddress"
echo -e "  • 194812161596: Should have foreign country"
