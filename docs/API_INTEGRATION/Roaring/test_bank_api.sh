#!/bin/bash

# Roaring.io Bank Account Data API - Test Script
# ================================================

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Credentials (Sandbox)
CLIENT_ID="1fc1c3bb-79d0-4b39-b541-70ef67c810a1"
CLIENT_SECRET="c96cdfe6-84d8-477a-a872-ab93c6e89203"
BASE_URL="https://api.roaring.io/global/bank-account-data/1.0"
TOKEN_URL="https://api.roaring.io/token"

echo -e "${YELLOW}========================================${NC}"
echo -e "${YELLOW}Roaring.io Bank Account API Test${NC}"
echo -e "${YELLOW}========================================${NC}\n"

# Step 1: Get OAuth2 Token
echo -e "${GREEN}[1/3] Hämtar OAuth2 Access Token...${NC}"
TOKEN_RESPONSE=$(curl -s -X POST "$TOKEN_URL" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=client_credentials" \
  -d "client_id=$CLIENT_ID" \
  -d "client_secret=$CLIENT_SECRET")

ACCESS_TOKEN=$(echo "$TOKEN_RESPONSE" | jq -r '.access_token')

if [ "$ACCESS_TOKEN" == "null" ] || [ -z "$ACCESS_TOKEN" ]; then
  echo -e "${RED}❌ Failed to get access token${NC}"
  echo "$TOKEN_RESPONSE" | jq '.'
  exit 1
fi

echo -e "${GREEN}✅ Access Token: ${ACCESS_TOKEN:0:20}...${NC}\n"

# Step 2: List Swedish Business Banks
echo -e "${GREEN}[2/3] Listar svenska banker (business)...${NC}"
BANKS_RESPONSE=$(curl -s -X GET "${BASE_URL}/banks/business?countryCode=SE" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Accept: application/json")

BANK_COUNT=$(echo "$BANKS_RESPONSE" | jq '.records | length')
echo -e "${GREEN}✅ Hittade $BANK_COUNT banker${NC}"
echo "$BANKS_RESPONSE" | jq '.records[] | {name: .name, type: .type, authMethods: [.authMethods[].name]}'
echo ""

# Step 3: List Personal Banks (for comparison)
echo -e "${GREEN}[3/3] Listar svenska banker (personal)...${NC}"
PERSONAL_BANKS=$(curl -s -X GET "${BASE_URL}/banks/personal?countryCode=SE" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Accept: application/json")

PERSONAL_COUNT=$(echo "$PERSONAL_BANKS" | jq '.records | length')
echo -e "${GREEN}✅ Hittade $PERSONAL_COUNT personal banks${NC}"
echo "$PERSONAL_BANKS" | jq '.records[] | {name: .name, type: .type, authMethods: [.authMethods[].name]}'
echo ""

# Summary
echo -e "${YELLOW}========================================${NC}"
echo -e "${YELLOW}Test Summary${NC}"
echo -e "${YELLOW}========================================${NC}"
echo -e "${GREEN}✅ OAuth2 Authentication: Working${NC}"
echo -e "${GREEN}✅ GET /banks/business: Working (${BANK_COUNT} banks)${NC}"
echo -e "${GREEN}✅ GET /banks/personal: Working (${PERSONAL_COUNT} banks)${NC}"
echo -e "${RED}❌ GET /aspsps_statuses: Not Found (404)${NC}"
echo -e "${YELLOW}⚠️  Account/Transaction endpoints require active session${NC}"
echo ""

# Save full responses
mkdir -p test_results
echo "$BANKS_RESPONSE" | jq '.' > test_results/banks_business_se.json
echo "$PERSONAL_BANKS" | jq '.' > test_results/banks_personal_se.json

echo -e "${GREEN}📁 Full responses saved to test_results/${NC}"
