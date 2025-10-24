#!/bin/bash

# Roaring.io Bank Account API - Full Flow Test with Mock ASPSP
# ==============================================================

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

CLIENT_ID="1fc1c3bb-79d0-4b39-b541-70ef67c810a1"
CLIENT_SECRET="c96cdfe6-84d8-477a-a872-ab93c6e89203"
BASE_URL="https://api.roaring.io/global/bank-account-data/1.0"
TOKEN_URL="https://api.roaring.io/token"
REDIRECT_URL="https://app.test.roaring.io/v2/open-banking/authorization"

echo -e "${YELLOW}======================================================${NC}"
echo -e "${YELLOW}Roaring.io Bank Account API - Full Auth Flow Test${NC}"
echo -e "${YELLOW}======================================================${NC}\n"

# Step 1: Get OAuth2 Token
echo -e "${BLUE}[1/5] Hämtar OAuth2 Access Token...${NC}"
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

# Step 2: Get Available Banks
echo -e "${BLUE}[2/5] Listar Mock ASPSP...${NC}"
BANKS=$(curl -s -X GET "${BASE_URL}/banks/business?countryCode=SE" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Accept: application/json")

MOCK_AVAILABLE=$(echo "$BANKS" | jq -r '.records[] | select(.name == "Mock ASPSP") | .name')

if [ "$MOCK_AVAILABLE" == "Mock ASPSP" ]; then
  echo -e "${GREEN}✅ Mock ASPSP hittad${NC}\n"
else
  echo -e "${RED}❌ Mock ASPSP ej tillgänglig${NC}"
  exit 1
fi

# Step 3: Initiate Auth Flow
echo -e "${BLUE}[3/5] Skapar auth session med Mock ASPSP...${NC}"
AUTH_RESPONSE=$(curl -s -X POST "${BASE_URL}/auth/url/SE/Mock%20ASPSP?redirectUrl=${REDIRECT_URL}" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{"type": "business"}')

AUTH_URL=$(echo "$AUTH_RESPONSE" | jq -r '.url')
SESSION_ID=$(echo "$AUTH_RESPONSE" | jq -r '.authorizationId')
STATE=$(echo "$AUTH_RESPONSE" | jq -r '.state')

if [ "$AUTH_URL" == "null" ] || [ -z "$AUTH_URL" ]; then
  echo -e "${RED}❌ Failed to create auth session${NC}"
  echo "$AUTH_RESPONSE" | jq '.'
  exit 1
fi

echo -e "${GREEN}✅ Auth URL skapad${NC}"
echo -e "${YELLOW}Session ID: ${SESSION_ID}${NC}"
echo -e "${YELLOW}State: ${STATE}${NC}"
echo -e "${YELLOW}Auth URL: ${AUTH_URL}${NC}\n"

# Step 4: Explain Manual Step
echo -e "${BLUE}[4/5] ${YELLOW}⚠️  MANUELL ÅTGÄRD KRÄVS${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}För att fortsätta behöver du:${NC}"
echo -e "${YELLOW}1. Öppna URL:en ovan i en webbläsare${NC}"
echo -e "${YELLOW}2. Genomför Mock ASPSP-autentisering${NC}"
echo -e "${YELLOW}3. Efter redirect, kopiera 'authCode' från URL:en${NC}"
echo -e "${YELLOW}4. Kör: ./get_account_data.sh <authCode>${NC}"
echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"

# Step 5: Save credentials for next script
echo -e "${BLUE}[5/5] Sparar session info...${NC}"
mkdir -p test_results

cat > test_results/auth_session.json <<EOF
{
  "access_token": "$ACCESS_TOKEN",
  "session_id": "$SESSION_ID",
  "state": "$STATE",
  "auth_url": "$AUTH_URL",
  "redirect_url": "$REDIRECT_URL",
  "timestamp": "$(date -u +%Y-%m-%dT%H:%M:%SZ)"
}
EOF

echo -e "${GREEN}✅ Session info sparad i test_results/auth_session.json${NC}\n"

# Summary
echo -e "${YELLOW}======================================================${NC}"
echo -e "${YELLOW}Test Summary${NC}"
echo -e "${YELLOW}======================================================${NC}"
echo -e "${GREEN}✅ OAuth2 token hämtad${NC}"
echo -e "${GREEN}✅ Mock ASPSP verifierad${NC}"
echo -e "${GREEN}✅ Auth session skapad${NC}"
echo -e "${YELLOW}⏳ Väntar på manuell autentisering${NC}"
echo ""
echo -e "${BLUE}Nästa steg:${NC}"
echo -e "1. Öppna: ${AUTH_URL}"
echo -e "2. Kör: ${GREEN}./get_account_data.sh <authCode>${NC}"
echo ""
