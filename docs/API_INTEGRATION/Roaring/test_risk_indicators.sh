#!/bin/bash

################################################################################
# Roaring Risk Indicators API - Complete Test Suite
# 
# Testar alla sandbox-endpoints:
# - OAuth2 token exchange (Client Credentials flow)
# - 2 templates (Weaker, Full)
# - 5 företag (olika risk-nivåer)
# - 10 kombinationer (template × företag)
# - 2 template-management endpoints
#
# Kräver: ROARING_CLIENT_ID och ROARING_CLIENT_SECRET i environment
################################################################################

set -euo pipefail

# Färger för output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
NC='\033[0m' # No Color

# OAuth2 & API URLs
OAUTH_TOKEN_URL="https://auth.roaring.io/oauth/token"
BASE_URL="https://api.roaring.io/se/company/risk/1.0"

# Templates
TEMPLATE_WEAKER="a0b55461-b2c3-409e-871b-3083ab5779fb"
TEMPLATE_FULL="4ecbaaaa-139f-4196-b365-477c87878919"

# Företag
COMPANY_PERFECT="5564881422"        # Lågrisk - perfekt stabilitet
COMPANY_NEW="5567164818"            # Nystartat - osäkerhet
COMPANY_LIQUIDATION="5560572850"    # Högrisk - likvidation
COMPANY_NO_REGS="5564866803"        # Mediumrisk - inga registreringar
COMPANY_GROWTH="5564779444"         # Mediumrisk - PEP + tillväxt

# Kontrollera OAuth2 credentials
if [ -z "${ROARING_CLIENT_ID:-}" ]; then
    echo -e "${RED}ERROR: ROARING_CLIENT_ID environment variable not set${NC}"
    echo ""
    echo -e "${YELLOW}Usage:${NC}"
    echo "  export ROARING_CLIENT_ID='your-client-id'"
    echo "  export ROARING_CLIENT_SECRET='your-client-secret'"
    echo "  ./test_risk_indicators.sh"
    echo ""
    exit 1
fi

if [ -z "${ROARING_CLIENT_SECRET:-}" ]; then
    echo -e "${RED}ERROR: ROARING_CLIENT_SECRET environment variable not set${NC}"
    echo ""
    echo -e "${YELLOW}Usage:${NC}"
    echo "  export ROARING_CLIENT_ID='your-client-id'"
    echo "  export ROARING_CLIENT_SECRET='your-client-secret'"
    echo "  ./test_risk_indicators.sh"
    echo ""
    exit 1
fi

################################################################################
# OAuth2 Token Exchange
################################################################################

echo -e "${MAGENTA}╔═══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${MAGENTA}║              OAuth2 Token Exchange (Client Credentials)       ║${NC}"
echo -e "${MAGENTA}╚═══════════════════════════════════════════════════════════════╝${NC}"
echo ""

echo -e "${BLUE}Exchanging Client ID + Secret for Access Token...${NC}"
echo -e "${BLUE}OAuth URL: ${OAUTH_TOKEN_URL}${NC}"
echo ""

# OAuth2 Client Credentials flow
TOKEN_RESPONSE=$(curl -s -X POST "${OAUTH_TOKEN_URL}" \
    --header 'Content-Type: application/x-www-form-urlencoded' \
    --data-urlencode "grant_type=client_credentials" \
    --data-urlencode "client_id=${ROARING_CLIENT_ID}" \
    --data-urlencode "client_secret=${ROARING_CLIENT_SECRET}" \
    --data-urlencode "scope=company:read" \
    2>&1)

# Kontrollera om token exchange lyckades
if echo "$TOKEN_RESPONSE" | jq -e '.access_token' > /dev/null 2>&1; then
    ACCESS_TOKEN=$(echo "$TOKEN_RESPONSE" | jq -r '.access_token')
    TOKEN_TYPE=$(echo "$TOKEN_RESPONSE" | jq -r '.token_type')
    EXPIRES_IN=$(echo "$TOKEN_RESPONSE" | jq -r '.expires_in')
    
    echo -e "${GREEN}✓ Token Exchange Successful!${NC}"
    echo -e "${BLUE}Token Type: ${TOKEN_TYPE}${NC}"
    echo -e "${BLUE}Expires In: ${EXPIRES_IN} seconds${NC}"
    echo -e "${BLUE}Access Token (first 20 chars): ${ACCESS_TOKEN:0:20}...${NC}"
    echo ""
else
    echo -e "${RED}✗ Token Exchange Failed!${NC}"
    echo -e "${RED}Response:${NC}"
    echo "$TOKEN_RESPONSE" | jq '.' 2>/dev/null || echo "$TOKEN_RESPONSE"
    echo ""
    echo -e "${YELLOW}Common Issues:${NC}"
    echo "  - Invalid Client ID or Secret"
    echo "  - Expired credentials"
    echo "  - Wrong OAuth endpoint URL"
    echo "  - Network/firewall issues"
    echo ""
    exit 1
fi

# Hjälpfunktion för API-anrop
call_api() {
    local endpoint="$1"
    local description="$2"
    
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${YELLOW}TEST: ${description}${NC}"
    echo -e "${BLUE}URL: ${BASE_URL}${endpoint}${NC}"
    
    local response=$(curl -s -w "\n%{http_code}" \
        --header 'Accept: application/json' \
        --header "Authorization: Bearer ${ACCESS_TOKEN}" \
        "${BASE_URL}${endpoint}")
    
    local http_code=$(echo "$response" | tail -n1)
    local body=$(echo "$response" | sed '$d')
    
    if [ "$http_code" == "200" ]; then
        echo -e "${GREEN}✓ SUCCESS (HTTP $http_code)${NC}"
        echo "$body" | jq '.' 2>/dev/null || echo "$body"
    else
        echo -e "${RED}✗ FAILED (HTTP $http_code)${NC}"
        echo "$body" | jq '.' 2>/dev/null || echo "$body"
    fi
    
    echo ""
    
    # Lägg till delay för att inte överbelasta API
    sleep 0.5
}

################################################################################
# TEST SUITE
################################################################################

echo -e "${GREEN}╔═══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║         ROARING RISK INDICATORS API - TEST SUITE             ║${NC}"
echo -e "${GREEN}╚═══════════════════════════════════════════════════════════════╝${NC}"
echo ""

# =============================================================================
# PART 1: Template Management
# =============================================================================

echo -e "${YELLOW}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${YELLOW}PART 1: Template Management${NC}"
echo -e "${YELLOW}═══════════════════════════════════════════════════════════════${NC}"
echo ""

call_api "/templates" \
    "List all available templates"

call_api "/template/${TEMPLATE_FULL}" \
    "Fetch Full Template configuration"

call_api "/template/${TEMPLATE_WEAKER}" \
    "Fetch Weaker Template configuration"

# =============================================================================
# PART 2: Risk Assessment - Perfect Company (5564881422)
# =============================================================================

echo -e "${YELLOW}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${YELLOW}PART 2: Perfect Company (5564881422) - Expected: LOW RISK${NC}"
echo -e "${YELLOW}═══════════════════════════════════════════════════════════════${NC}"
echo ""

call_api "/${TEMPLATE_WEAKER}/${COMPANY_PERFECT}" \
    "Perfect Company + Weaker Template (should be APPROVED)"

call_api "/${TEMPLATE_FULL}/${COMPANY_PERFECT}" \
    "Perfect Company + Full Template (should be APPROVED)"

# =============================================================================
# PART 3: Risk Assessment - New Company (5567164818)
# =============================================================================

echo -e "${YELLOW}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${YELLOW}PART 3: New Company (5567164818) - Expected: LOW-MEDIUM${NC}"
echo -e "${YELLOW}═══════════════════════════════════════════════════════════════${NC}"
echo ""

call_api "/${TEMPLATE_WEAKER}/${COMPANY_NEW}" \
    "New Company + Weaker Template (should be APPROVED WITH UNCERTAINTY)"

call_api "/${TEMPLATE_FULL}/${COMPANY_NEW}" \
    "New Company + Full Template (should be APPROVED WITH UNCERTAINTY)"

# =============================================================================
# PART 4: Risk Assessment - Liquidation Company (5560572850)
# =============================================================================

echo -e "${YELLOW}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${YELLOW}PART 4: Liquidation Company (5560572850) - Expected: REJECT${NC}"
echo -e "${YELLOW}═══════════════════════════════════════════════════════════════${NC}"
echo ""

call_api "/${TEMPLATE_WEAKER}/${COMPANY_LIQUIDATION}" \
    "Liquidation + Weaker Template (should be HIGH RISK)"

call_api "/${TEMPLATE_FULL}/${COMPANY_LIQUIDATION}" \
    "Liquidation + Full Template (should be REJECT)"

# =============================================================================
# PART 5: Risk Assessment - No Registrations (5564866803)
# =============================================================================

echo -e "${YELLOW}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${YELLOW}PART 5: No Registrations (5564866803) - Expected: MEDIUM-HIGH${NC}"
echo -e "${YELLOW}═══════════════════════════════════════════════════════════════${NC}"
echo ""

call_api "/${TEMPLATE_WEAKER}/${COMPANY_NO_REGS}" \
    "No Registrations + Weaker Template (should be MANUAL REVIEW)"

call_api "/${TEMPLATE_FULL}/${COMPANY_NO_REGS}" \
    "No Registrations + Full Template (should be ENHANCED DD)"

# =============================================================================
# PART 6: Risk Assessment - Growth with PEP (5564779444)
# =============================================================================

echo -e "${YELLOW}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${YELLOW}PART 6: Growth with PEP (5564779444) - Expected: MEDIUM${NC}"
echo -e "${YELLOW}═══════════════════════════════════════════════════════════════${NC}"
echo ""

call_api "/${TEMPLATE_WEAKER}/${COMPANY_GROWTH}" \
    "Growth+PEP + Weaker Template (should be MANUAL REVIEW)"

call_api "/${TEMPLATE_FULL}/${COMPANY_GROWTH}" \
    "Growth+PEP + Full Template (should be ENHANCED DD)"

# =============================================================================
# SUMMARY
# =============================================================================

echo -e "${GREEN}╔═══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║                       TEST SUMMARY                            ║${NC}"
echo -e "${GREEN}╚═══════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${BLUE}Total Endpoints Tested: 13${NC}"
echo -e "${BLUE}  - Template Management: 3${NC}"
echo -e "${BLUE}  - Risk Assessments: 10 (2 templates × 5 companies)${NC}"
echo ""
echo -e "${YELLOW}Expected Results Summary:${NC}"
echo ""
echo -e "Company 5564881422 (Perfect):"
echo -e "  Weaker: ${GREEN}APPROVED${NC} (score ~0)"
echo -e "  Full:   ${GREEN}APPROVED${NC} (score ~0)"
echo ""
echo -e "Company 5567164818 (New):"
echo -e "  Weaker: ${GREEN}APPROVED WITH UNCERTAINTY${NC} (score ~11)"
echo -e "  Full:   ${GREEN}APPROVED WITH UNCERTAINTY${NC} (score ~15)"
echo ""
echo -e "Company 5560572850 (Liquidation):"
echo -e "  Weaker: ${YELLOW}HIGH RISK${NC} (score ~55)"
echo -e "  Full:   ${RED}REJECT${NC} (score 100, status 352)"
echo ""
echo -e "Company 5564866803 (No Registrations):"
echo -e "  Weaker: ${YELLOW}MANUAL REVIEW${NC} (score ~28)"
echo -e "  Full:   ${YELLOW}ENHANCED DD${NC} (score ~48)"
echo ""
echo -e "Company 5564779444 (Growth + PEP):"
echo -e "  Weaker: ${YELLOW}MANUAL REVIEW${NC} (score ~18)"
echo -e "  Full:   ${YELLOW}ENHANCED DD${NC} (score ~32)"
echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}Analysis Complete! Review responses above.${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
