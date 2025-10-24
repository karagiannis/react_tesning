#!/bin/bash

################################################################################
# Roaring OAuth2 - Get Access Token
# 
# Hämtar access token från Client ID + Client Secret
# 
# Usage:
#   export ROARING_CLIENT_ID='your-client-id'
#   export ROARING_CLIENT_SECRET='your-client-secret'
#   ./get_access_token.sh
################################################################################

set -euo pipefail

# Färger
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# OAuth2 endpoint (gissa, kan behöva justeras)
OAUTH_TOKEN_URL="https://auth.roaring.io/oauth/token"

# Alternativa OAuth endpoints om första inte fungerar:
# OAUTH_TOKEN_URL="https://api.roaring.io/oauth/token"
# OAUTH_TOKEN_URL="https://login.roaring.io/oauth/token"

echo -e "${BLUE}╔═══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║           Roaring OAuth2 - Access Token Generator             ║${NC}"
echo -e "${BLUE}╚═══════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Kontrollera credentials
if [ -z "${ROARING_CLIENT_ID:-}" ]; then
    echo -e "${RED}ERROR: ROARING_CLIENT_ID not set${NC}"
    echo ""
    echo -e "${YELLOW}Usage:${NC}"
    echo "  export ROARING_CLIENT_ID='your-client-id'"
    echo "  export ROARING_CLIENT_SECRET='your-client-secret'"
    echo "  ./get_access_token.sh"
    echo ""
    exit 1
fi

if [ -z "${ROARING_CLIENT_SECRET:-}" ]; then
    echo -e "${RED}ERROR: ROARING_CLIENT_SECRET not set${NC}"
    echo ""
    echo -e "${YELLOW}Usage:${NC}"
    echo "  export ROARING_CLIENT_ID='your-client-id'"
    echo "  export ROARING_CLIENT_SECRET='your-client-secret'"
    echo "  ./get_access_token.sh"
    echo ""
    exit 1
fi

echo -e "${BLUE}Client ID:${NC} ${ROARING_CLIENT_ID:0:10}...${ROARING_CLIENT_ID: -10}"
echo -e "${BLUE}Client Secret:${NC} ${ROARING_CLIENT_SECRET:0:5}...${ROARING_CLIENT_SECRET: -5}"
echo -e "${BLUE}OAuth URL:${NC} ${OAUTH_TOKEN_URL}"
echo ""

echo -e "${YELLOW}Requesting access token...${NC}"
echo ""

# OAuth2 Client Credentials Grant
# Standard enligt RFC 6749
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "${OAUTH_TOKEN_URL}" \
    --header 'Content-Type: application/x-www-form-urlencoded' \
    --data-urlencode "grant_type=client_credentials" \
    --data-urlencode "client_id=${ROARING_CLIENT_ID}" \
    --data-urlencode "client_secret=${ROARING_CLIENT_SECRET}" \
    --data-urlencode "scope=company:read" \
    2>&1)

HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | sed '$d')

if [ "$HTTP_CODE" == "200" ]; then
    echo -e "${GREEN}✓ Success! (HTTP 200)${NC}"
    echo ""
    
    # Parsa JSON response
    ACCESS_TOKEN=$(echo "$BODY" | jq -r '.access_token')
    TOKEN_TYPE=$(echo "$BODY" | jq -r '.token_type')
    EXPIRES_IN=$(echo "$BODY" | jq -r '.expires_in')
    SCOPE=$(echo "$BODY" | jq -r '.scope // "N/A"')
    
    echo -e "${BLUE}Token Type:${NC} ${TOKEN_TYPE}"
    echo -e "${BLUE}Expires In:${NC} ${EXPIRES_IN} seconds (~$((EXPIRES_IN / 60)) minutes)"
    echo -e "${BLUE}Scope:${NC} ${SCOPE}"
    echo ""
    
    echo -e "${GREEN}Access Token:${NC}"
    echo "${ACCESS_TOKEN}"
    echo ""
    
    echo -e "${YELLOW}To use this token:${NC}"
    echo "  export ROARING_ACCESS_TOKEN='${ACCESS_TOKEN}'"
    echo ""
    echo -e "${YELLOW}Or save to file:${NC}"
    echo "  echo 'export ROARING_ACCESS_TOKEN=\"${ACCESS_TOKEN}\"' > .roaring_token"
    echo "  source .roaring_token"
    echo ""
    
    # Spara till fil om möjligt
    if [ -w "." ]; then
        echo "export ROARING_ACCESS_TOKEN=\"${ACCESS_TOKEN}\"" > .roaring_token
        echo -e "${GREEN}✓ Token saved to .roaring_token${NC}"
        echo -e "${YELLOW}Load with: source .roaring_token${NC}"
        echo ""
    fi
    
else
    echo -e "${RED}✗ Failed! (HTTP ${HTTP_CODE})${NC}"
    echo ""
    echo -e "${RED}Response:${NC}"
    echo "$BODY" | jq '.' 2>/dev/null || echo "$BODY"
    echo ""
    
    echo -e "${YELLOW}Common Issues:${NC}"
    echo "  1. Invalid Client ID or Secret"
    echo "  2. Wrong OAuth endpoint URL"
    echo "  3. Credentials expired or revoked"
    echo "  4. Scope 'company:read' not granted"
    echo ""
    
    echo -e "${YELLOW}Try checking:${NC}"
    echo "  - Roaring Developer Portal for correct credentials"
    echo "  - API documentation for correct OAuth endpoint"
    echo "  - Network connectivity (curl https://api.roaring.io)"
    echo ""
    
    exit 1
fi
