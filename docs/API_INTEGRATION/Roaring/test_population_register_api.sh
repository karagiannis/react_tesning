#!/bin/bash

# Population Register API (SPAR) - Test Script
# =============================================

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

CLIENT_ID="1fc1c3bb-79d0-4b39-b541-70ef67c810a1"
CLIENT_SECRET="c96cdfe6-84d8-477a-a872-ab93c6e89203"
BASE_URL="https://api.roaring.io/person/2.0"
TOKEN_URL="https://api.roaring.io/token"

echo -e "${YELLOW}========================================${NC}"
echo -e "${YELLOW}Population Register API (SPAR) Test${NC}"
echo -e "${YELLOW}========================================${NC}\n"

# Step 1: Get OAuth2 Token
echo -e "${BLUE}[1/4] Hämtar OAuth2 Access Token...${NC}"
TOKEN_RESPONSE=$(curl -s -X POST "$TOKEN_URL" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=client_credentials" \
  -d "client_id=$CLIENT_ID" \
  -d "client_secret=$CLIENT_SECRET")

ACCESS_TOKEN=$(echo "$TOKEN_RESPONSE" | jq -r '.access_token')

if [ "$ACCESS_TOKEN" == "null" ] || [ -z "$ACCESS_TOKEN" ]; then
  echo -e "${RED}❌ Failed to get access token${NC}"
  exit 1
fi

echo -e "${GREEN}✅ Access Token: ${ACCESS_TOKEN:0:30}...${NC}\n"

# Step 2: Test /current endpoint
echo -e "${BLUE}[2/4] Testar /current endpoint (apartment number)...${NC}"
CURRENT_RESPONSE=$(curl -s -X GET "${BASE_URL}/current/198001139297" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Accept: application/json")

CURRENT_STATUS=$(echo "$CURRENT_RESPONSE" | jq -r '.status.code')
CURRENT_MODE=$(echo "$CURRENT_RESPONSE" | jq -r '.status.responseMode')

if [ "$CURRENT_STATUS" == "0" ]; then
  echo -e "${GREEN}✅ Person hittad${NC}"
  echo -e "${YELLOW}Response Mode: ${CURRENT_MODE}${NC}"
  
  # Extract key info
  PERSON_ID=$(echo "$CURRENT_RESPONSE" | jq -r '.records[0].personId')
  PERSON_TYPE=$(echo "$CURRENT_RESPONSE" | jq -r '.records[0].personIdType')
  FIRST_NAME=$(echo "$CURRENT_RESPONSE" | jq -r '.records[0].name[0].firstName')
  SUR_NAME=$(echo "$CURRENT_RESPONSE" | jq -r '.records[0].name[0].surName')
  
  echo -e "${GREEN}PersonID: ${PERSON_ID}${NC}"
  echo -e "${GREEN}Type: ${PERSON_TYPE}${NC}"
  echo -e "${GREEN}Name: ${FIRST_NAME} ${SUR_NAME}${NC}\n"
  
  # Save response
  mkdir -p test_results
  echo "$CURRENT_RESPONSE" | jq '.' > test_results/spar_current_198001139297.json
else
  echo -e "${RED}❌ Person ej hittad eller fel inträffade${NC}"
  echo "$CURRENT_RESPONSE" | jq '.'
fi

# Step 3: Test /full endpoint
echo -e "${BLUE}[3/4] Testar /full endpoint (med historik)...${NC}"
FULL_RESPONSE=$(curl -s -X GET "${BASE_URL}/full/198001139297" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Accept: application/json")

FULL_STATUS=$(echo "$FULL_RESPONSE" | jq -r '.status.code')
FULL_MODE=$(echo "$FULL_RESPONSE" | jq -r '.status.responseMode')

if [ "$FULL_STATUS" == "0" ]; then
  echo -e "${GREEN}✅ Fullständig data hämtad${NC}"
  echo -e "${YELLOW}Response Mode: ${FULL_MODE}${NC}"
  
  # Check for historical data
  NAME_COUNT=$(echo "$FULL_RESPONSE" | jq '.records[0].name | length')
  DETAILS_COUNT=$(echo "$FULL_RESPONSE" | jq '.records[0].details | length')
  ADDRESS_COUNT=$(echo "$FULL_RESPONSE" | jq '.records[0].populationRegistrationAddress | length')
  
  echo -e "${GREEN}Name records: ${NAME_COUNT}${NC}"
  echo -e "${GREEN}Detail records: ${DETAILS_COUNT}${NC}"
  echo -e "${GREEN}Address records: ${ADDRESS_COUNT}${NC}\n"
  
  # Save response
  echo "$FULL_RESPONSE" | jq '.' > test_results/spar_full_198001139297.json
else
  echo -e "${RED}❌ Kunde inte hämta fullständig data${NC}"
  echo "$FULL_RESPONSE" | jq '.'
fi

# Step 4: Test PEP person
echo -e "${BLUE}[4/4] Testar PEP-person (Sven, ABO & PEP)...${NC}"
PEP_RESPONSE=$(curl -s -X GET "${BASE_URL}/current/193102263153" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Accept: application/json")

PEP_STATUS=$(echo "$PEP_RESPONSE" | jq -r '.status.code')

if [ "$PEP_STATUS" == "0" ]; then
  echo -e "${GREEN}✅ PEP-person hittad${NC}"
  
  PEP_NAME=$(echo "$PEP_RESPONSE" | jq -r '.records[0].name[0].firstName + " " + .records[0].name[0].surName')
  echo -e "${YELLOW}Name: ${PEP_NAME}${NC}"
  echo -e "${RED}⚠️  Denna person är markerad som PEP (Politically Exposed Person)${NC}\n"
  
  # Save response
  echo "$PEP_RESPONSE" | jq '.' > test_results/spar_pep_193102263153.json
else
  echo -e "${RED}❌ PEP-person ej hittad${NC}"
fi

# Summary
echo -e "${YELLOW}========================================${NC}"
echo -e "${YELLOW}Test Summary${NC}"
echo -e "${YELLOW}========================================${NC}"

if [ "$CURRENT_STATUS" == "0" ]; then
  echo -e "${GREEN}✅ /current endpoint: Working${NC}"
else
  echo -e "${RED}❌ /current endpoint: Failed${NC}"
fi

if [ "$FULL_STATUS" == "0" ]; then
  echo -e "${GREEN}✅ /full endpoint: Working${NC}"
else
  echo -e "${RED}❌ /full endpoint: Failed${NC}"
fi

if [ "$PEP_STATUS" == "0" ]; then
  echo -e "${GREEN}✅ PEP test: Working${NC}"
else
  echo -e "${RED}❌ PEP test: Failed${NC}"
fi

echo ""
echo -e "${BLUE}Response Mode Explanation:${NC}"
echo -e "  0 = DIRECT (Skatteverkets SPAR-API)"
echo -e "  1 = FALLBACK (Cached after error/timeout)"
echo -e "  2 = CACHED (ALWAYS mode)"
echo ""

echo -e "${GREEN}📁 Responses saved to test_results/${NC}"
echo -e "  - spar_current_198001139297.json"
echo -e "  - spar_full_198001139297.json"
echo -e "  - spar_pep_193102263153.json"
echo ""

# Additional test cases
echo -e "${BLUE}Additional Sandbox Test Cases:${NC}"
echo -e "${YELLOW}Test deceased person:${NC} curl ... /current/198604069883"
echo -e "${YELLOW}Test coordination number:${NC} curl ... /current/197605832380"
echo -e "${YELLOW}Test protected registration:${NC} curl ... /current/198106039228"
echo -e "${YELLOW}Test secrecy:${NC} curl ... /current/198203249274"
echo -e "${YELLOW}Test emigrated:${NC} curl ... /current/198307259294"
echo ""
