#!/bin/bash

# Test script för Mock Fortnox API
# Kör alla endpoints och visar resultat

echo "======================================"
echo "Testing Mock Fortnox API"
echo "======================================"
echo ""

BASE_URL="http://localhost:8000"
COMPANY_ID="5560123456"

# Färgkoder
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Kolla om servern körs
echo "🔍 Checking if server is running..."
if curl -s "$BASE_URL" > /dev/null; then
    echo -e "${GREEN}✓ Server is running!${NC}"
else
    echo -e "${RED}✗ Server is not running. Start it with: python main.py${NC}"
    exit 1
fi

echo ""
echo "======================================"
echo "1. Root endpoint (health check)"
echo "======================================"
curl -s "$BASE_URL" | jq '.'

echo ""
echo "======================================"
echo "2. Hämta SIE-filer (3 år)"
echo "======================================"
curl -s "$BASE_URL/api/v1/companies/$COMPANY_ID/sie?years=3" | jq '.'

echo ""
echo "======================================"
echo "3. Hämta verifikationer med fel"
echo "======================================"
curl -s "$BASE_URL/api/v1/companies/$COMPANY_ID/vouchers" | jq '.errors[] | {voucher_number, date, description, severity}'

echo ""
echo "======================================"
echo "4. Hämta kontoplan"
echo "======================================"
curl -s "$BASE_URL/api/v1/companies/$COMPANY_ID/accounts" | jq '.accounts[] | {account_number, name, balance}'

echo ""
echo "======================================"
echo "5. Hämta likviditetsdata"
echo "======================================"
curl -s "$BASE_URL/api/v1/companies/$COMPANY_ID/balance" | jq '{key_metrics: .key_metrics, layering: .layering_analysis}'

echo ""
echo "======================================"
echo "6. Riskbedömning - LÅG RISK"
echo "======================================"
curl -s -X POST "$BASE_URL/api/v1/onboarding/assess-risk" \
  -H "Content-Type: application/json" \
  -d '{
    "company_id": "'$COMPANY_ID'",
    "branch_code": "konsult",
    "is_pep": false,
    "is_new_company": false,
    "high_risk_country": false,
    "complex_structure": false,
    "negative_media": false
  }' | jq '{risk_score, risk_level, decision}'

echo ""
echo "======================================"
echo "7. Riskbedömning - NORMAL RISK"
echo "======================================"
curl -s -X POST "$BASE_URL/api/v1/onboarding/assess-risk" \
  -H "Content-Type: application/json" \
  -d '{
    "company_id": "'$COMPANY_ID'",
    "branch_code": "bokforing",
    "is_pep": false,
    "is_new_company": true,
    "high_risk_country": false,
    "complex_structure": false,
    "negative_media": false
  }' | jq '{risk_score, risk_level, decision}'

echo ""
echo "======================================"
echo "8. Riskbedömning - HÖG RISK"
echo "======================================"
curl -s -X POST "$BASE_URL/api/v1/onboarding/assess-risk" \
  -H "Content-Type: application/json" \
  -d '{
    "company_id": "'$COMPANY_ID'",
    "branch_code": "restaurang",
    "is_pep": true,
    "is_new_company": true,
    "high_risk_country": true,
    "complex_structure": false,
    "negative_media": false
  }' | jq '{risk_score, risk_level, decision, calculation}'

echo ""
echo "======================================"
echo -e "${GREEN}✓ All tests completed!${NC}"
echo "======================================"
echo ""
echo "📝 Next steps:"
echo "   1. Start React frontend: npm run dev"
echo "   2. Integrate these endpoints in your components"
echo "   3. Deploy to Railway/Render for Fortnox demo"
echo ""
