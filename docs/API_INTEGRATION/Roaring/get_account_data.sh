#!/bin/bash

# Get Account Data after Auth - Step 2 of Bank API Test
# =======================================================

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

BASE_URL="https://api.roaring.io/global/bank-account-data/1.0"

if [ -z "$1" ]; then
  echo -e "${RED}❌ Missing authCode parameter${NC}"
  echo -e "${YELLOW}Usage: ./get_account_data.sh <authCode>${NC}"
  echo -e "${YELLOW}Get authCode from redirect URL after completing bank authentication${NC}"
  exit 1
fi

AUTH_CODE="$1"

if [ ! -f "test_results/auth_session.json" ]; then
  echo -e "${RED}❌ auth_session.json not found${NC}"
  echo -e "${YELLOW}Run ./test_bank_auth_flow.sh first${NC}"
  exit 1
fi

ACCESS_TOKEN=$(jq -r '.access_token' test_results/auth_session.json)

echo -e "${YELLOW}======================================================${NC}"
echo -e "${YELLOW}Roaring.io - Get Account Data${NC}"
echo -e "${YELLOW}======================================================${NC}\n"

# Step 1: Get Auth Session
echo -e "${BLUE}[1/3] Hämtar auth session med authCode...${NC}"
SESSION_RESPONSE=$(curl -s -X GET "${BASE_URL}/auth/session?authCode=${AUTH_CODE}" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Accept: application/json")

echo "$SESSION_RESPONSE" | jq '.' > test_results/session_response.json

ACCOUNT_ID=$(echo "$SESSION_RESPONSE" | jq -r '.accounts[0].account_id // .accountId // empty')

if [ -z "$ACCOUNT_ID" ] || [ "$ACCOUNT_ID" == "null" ]; then
  echo -e "${RED}❌ Kunde inte hitta account_id i response${NC}"
  echo -e "${YELLOW}Full response:${NC}"
  echo "$SESSION_RESPONSE" | jq '.'
  exit 1
fi

echo -e "${GREEN}✅ Session hämtad${NC}"
echo -e "${YELLOW}Account ID: ${ACCOUNT_ID}${NC}\n"

# Step 2: Get Account Details
echo -e "${BLUE}[2/3] Hämtar kontouppgifter...${NC}"
ACCOUNT_DETAILS=$(curl -s -X GET "${BASE_URL}/account/details/${ACCOUNT_ID}" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Accept: application/json")

echo "$ACCOUNT_DETAILS" | jq '.' > test_results/account_details.json

echo -e "${GREEN}✅ Kontouppgifter hämtade${NC}"
echo "$ACCOUNT_DETAILS" | jq '.'
echo ""

# Step 3: Get Transactions
echo -e "${BLUE}[3/3] Hämtar transaktioner (senaste 90 dagarna)...${NC}"

FROM_DATE=$(date -d "90 days ago" +%Y-%m-%d)
TO_DATE=$(date +%Y-%m-%d)

TRANSACTIONS=$(curl -s -X GET "${BASE_URL}/account/${ACCOUNT_ID}/transactions?fromDate=${FROM_DATE}&toDate=${TO_DATE}" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Accept: application/json")

echo "$TRANSACTIONS" | jq '.' > test_results/transactions.json

TRANSACTION_COUNT=$(echo "$TRANSACTIONS" | jq '.transactions | length // 0')

echo -e "${GREEN}✅ Transaktioner hämtade: ${TRANSACTION_COUNT} st${NC}"
echo "$TRANSACTIONS" | jq '.'
echo ""

# Summary
echo -e "${YELLOW}======================================================${NC}"
echo -e "${YELLOW}Test Summary${NC}"
echo -e "${YELLOW}======================================================${NC}"
echo -e "${GREEN}✅ Auth session retrieved${NC}"
echo -e "${GREEN}✅ Account details fetched${NC}"
echo -e "${GREEN}✅ Transactions fetched (${TRANSACTION_COUNT} items)${NC}"
echo ""
echo -e "${BLUE}Files saved:${NC}"
echo -e "  - test_results/session_response.json"
echo -e "  - test_results/account_details.json"
echo -e "  - test_results/transactions.json"
echo ""
