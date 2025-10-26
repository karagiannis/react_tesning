#!/usr/bin/env python3
"""
Roaring.io KYC Templates & Questions Test
==========================================
Testar deras färdiga KYC-frågemallar för att se vad de erbjuder.

Endpoints:
1. GET /global/kyc/1.0/company/templates - Lista företagsmallar
2. GET /global/kyc/1.0/company/questions - Hämta företagsfrågor
3. GET /global/kyc/1.0/person/templates - Lista personmallar
4. GET /global/kyc/1.0/person/questions - Hämta personfrågor
"""

import json
import sys
from pathlib import Path
from typing import Dict, List, Optional, Any

import requests

# Add parent directory to path to import credentials
sys.path.insert(0, str(Path(__file__).parent.parent))
from credentials import get_oauth2_credentials


class RoaringKYCTester:
    """Test Roaring.io KYC question templates."""
    
    def __init__(self):
        """Initialize med authentication."""
        self.base_url = 'https://api.roaring.io/global/kyc/1.0'
        self.access_token: Optional[str] = None
        
    def authenticate(self) -> bool:
        """OAuth2 authentication."""
        print(f"\n{'='*70}")
        print(f"🔐 Autentisering")
        print(f"{'='*70}")
        
        try:
            client_id, client_secret, token_url = get_oauth2_credentials()
            
            response = requests.post(
                token_url,
                data={
                    'grant_type': 'client_credentials',
                    'client_id': client_id,
                    'client_secret': client_secret
                },
                headers={'Content-Type': 'application/x-www-form-urlencoded'},
                timeout=10
            )
            
            if response.status_code == 200:
                token_data = response.json()
                self.access_token = token_data.get('access_token')
                print(f"✅ Autentisering lyckades")
                return True
            else:
                print(f"❌ Autentisering misslyckades: {response.status_code}")
                print(f"   {response.text}")
                return False
                
        except Exception as e:
            print(f"❌ Autentiseringsfel: {str(e)}")
            return False
    
    def _api_request(self, endpoint: str, params: Dict) -> Optional[Dict]:
        """Gör API-anrop."""
        if not self.access_token:
            print("❌ Inte autentiserad!")
            return None
        
        url = f"{self.base_url}{endpoint}"
        headers = {
            'Authorization': f'Bearer {self.access_token}',
            'Accept': 'application/json'
        }
        
        try:
            response = requests.get(
                url,
                headers=headers,
                params=params,
                timeout=15
            )
            
            if response.status_code == 200:
                return response.json()
            else:
                return {
                    'error': True,
                    'status_code': response.status_code,
                    'message': response.text
                }
                
        except Exception as e:
            return {
                'error': True,
                'exception': str(e)
            }
    
    def get_company_templates(self, language: str = 'sv', country: str = 'SE') -> Dict:
        """
        Hämta tillgängliga företagsmallar.
        
        Args:
            language: Språkkod (sv, en, etc.)
            country: Landskod (SE, NO, DK, etc.)
        """
        print(f"\n{'='*70}")
        print(f"📋 Företagsmallar - {language.upper()}/{country}")
        print(f"{'='*70}")
        
        params = {
            'language': language,
            'country': country
        }
        
        result = self._api_request('/company/templates', params)
        
        if result and not result.get('error'):
            templates = result.get('questions', [])  # Ja, de kallar det "questions" :/
            
            print(f"✅ Hittade {len(templates)} mall(ar)")
            
            for idx, template in enumerate(templates, 1):
                print(f"\n   Mall {idx}:")
                print(f"     ID: {template.get('id')}")
                print(f"     Namn: {template.get('name')}")
                print(f"     Beskrivning: {template.get('description', 'N/A')}")
            
            return result
        else:
            print(f"❌ Kunde inte hämta mallar")
            print(f"   Error: {result}")
            return result
    
    def get_company_questions(self, template_id: str, language: str = 'sv') -> Dict:
        """
        Hämta frågor från en företagsmall.
        
        Args:
            template_id: Mall-ID från get_company_templates()
            language: Språkkod
        """
        print(f"\n{'='*70}")
        print(f"❓ Företagsfrågor - Mall: {template_id}")
        print(f"{'='*70}")
        
        params = {
            'template': template_id,
            'language': language
        }
        
        result = self._api_request('/company/questions', params)
        
        if result and not result.get('error'):
            questions = result.get('questions', [])
            
            print(f"✅ Hittade {len(questions)} fråga(or)")
            
            for q in questions:
                print(f"\n   📝 Fråga {q.get('index', '?')}:")
                print(f"      ID: {q.get('id')}")
                print(f"      Fråga: {q.get('question')}")
                
                if q.get('description'):
                    print(f"      Beskrivning: {q.get('description')}")
                
                print(f"      Obligatorisk: {'Ja' if q.get('required') else 'Nej'}")
                print(f"      Multipla svar: {'Ja' if q.get('multiple') else 'Nej'}")
                
                if q.get('parentAnswerOption'):
                    print(f"      ⚠️ Villkorlig (visas bara om parent = {q.get('parentAnswerOption')})")
                
                answer_options = q.get('answerOptions', [])
                if answer_options:
                    print(f"      Svarsalternativ ({len(answer_options)} st):")
                    for opt in answer_options:
                        opt_text = opt.get('answerOption')
                        opt_type = opt.get('type', 'DEFAULT')
                        opt_desc = opt.get('description', '')
                        
                        if opt_type == 'FREE_TEXT':
                            print(f"        - [FRITEXT] {opt_text}")
                        elif opt_type == 'COUNTRY':
                            print(f"        - [LAND] {opt_text}")
                        else:
                            print(f"        - {opt_text}")
                        
                        if opt_desc:
                            print(f"          └─ {opt_desc}")
            
            return result
        else:
            print(f"❌ Kunde inte hämta frågor")
            print(f"   Error: {result}")
            return result
    
    def get_person_templates(self, language: str = 'sv') -> Dict:
        """
        Hämta tillgängliga personmallar.
        
        Args:
            language: Språkkod (sv, en, etc.)
        """
        print(f"\n{'='*70}")
        print(f"👤 Personmallar - {language.upper()}")
        print(f"{'='*70}")
        
        params = {'language': language}
        
        result = self._api_request('/person/templates', params)
        
        if result and not result.get('error'):
            templates = result.get('questions', [])
            
            print(f"✅ Hittade {len(templates)} mall(ar)")
            
            for idx, template in enumerate(templates, 1):
                print(f"\n   Mall {idx}:")
                print(f"     ID: {template.get('id')}")
                print(f"     Namn: {template.get('name')}")
                print(f"     Beskrivning: {template.get('description', 'N/A')}")
            
            return result
        else:
            print(f"❌ Kunde inte hämta mallar")
            print(f"   Error: {result}")
            return result
    
    def get_person_questions(self, template_id: str, language: str = 'sv') -> Dict:
        """
        Hämta frågor från en personmall.
        
        Args:
            template_id: Mall-ID från get_person_templates()
            language: Språkkod
        """
        print(f"\n{'='*70}")
        print(f"❓ Personfrågor - Mall: {template_id}")
        print(f"{'='*70}")
        
        params = {
            'template': template_id,
            'language': language
        }
        
        result = self._api_request('/person/questions', params)
        
        if result and not result.get('error'):
            questions = result.get('questions', [])
            
            print(f"✅ Hittade {len(questions)} fråga(or)")
            
            for q in questions:
                print(f"\n   📝 Fråga {q.get('index', '?')}:")
                print(f"      ID: {q.get('id')}")
                print(f"      Fråga: {q.get('question')}")
                
                if q.get('description'):
                    print(f"      Beskrivning: {q.get('description')}")
                
                print(f"      Obligatorisk: {'Ja' if q.get('required') else 'Nej'}")
                print(f"      Multipla svar: {'Ja' if q.get('multiple') else 'Nej'}")
                
                if q.get('parentAnswerOption'):
                    print(f"      ⚠️ Villkorlig (visas bara om parent = {q.get('parentAnswerOption')})")
                
                answer_options = q.get('answerOptions', [])
                if answer_options:
                    print(f"      Svarsalternativ ({len(answer_options)} st):")
                    for opt in answer_options:
                        opt_text = opt.get('answerOption')
                        opt_type = opt.get('type', 'DEFAULT')
                        
                        if opt_type == 'FREE_TEXT':
                            print(f"        - [FRITEXT] {opt_text}")
                        elif opt_type == 'COUNTRY':
                            print(f"        - [LAND] {opt_text}")
                        else:
                            print(f"        - {opt_text}")
            
            return result
        else:
            print(f"❌ Kunde inte hämta frågor")
            print(f"   Error: {result}")
            return result
    
    def run_full_test(self, language: str = 'sv', country: str = 'SE'):
        """Kör komplett test av alla KYC-endpoints."""
        print(f"\n{'#'*70}")
        print(f"# ROARING.IO KYC TEMPLATES TEST")
        print(f"# Språk: {language}, Land: {country}")
        print(f"{'#'*70}")
        
        # Autentisera
        if not self.authenticate():
            print("\n❌ Autentisering misslyckades. Avbryter.")
            return
        
        # 1. Hämta företagsmallar
        company_templates_result = self.get_company_templates(language, country)
        
        # 2. Om vi har mallar, hämta frågor från första mallen
        if company_templates_result and not company_templates_result.get('error'):
            templates = company_templates_result.get('questions', [])
            if templates:
                first_template_id = templates[0].get('id')
                company_questions_result = self.get_company_questions(first_template_id, language)
                
                # Spara resultat
                output_file = Path(f'roaring_company_questions_{first_template_id}.json')
                with open(output_file, 'w', encoding='utf-8') as f:
                    json.dump(company_questions_result, f, indent=2, ensure_ascii=False)
                print(f"\n💾 Företagsfrågor sparade i: {output_file}")
        
        # 3. Hämta personmallar
        person_templates_result = self.get_person_templates(language)
        
        # 4. Om vi har mallar, hämta frågor från första mallen
        if person_templates_result and not person_templates_result.get('error'):
            templates = person_templates_result.get('questions', [])
            if templates:
                first_template_id = templates[0].get('id')
                person_questions_result = self.get_person_questions(first_template_id, language)
                
                # Spara resultat
                output_file = Path(f'roaring_person_questions_{first_template_id}.json')
                with open(output_file, 'w', encoding='utf-8') as f:
                    json.dump(person_questions_result, f, indent=2, ensure_ascii=False)
                print(f"\n💾 Personfrågor sparade i: {output_file}")
        
        print(f"\n{'='*70}")
        print(f"✅ TEST KLART")
        print(f"{'='*70}")


def main():
    """CLI entry point."""
    import argparse
    
    parser = argparse.ArgumentParser(description='Testa Roaring.io KYC endpoints')
    parser.add_argument('--language', default='sv', help='Språkkod (sv, en, etc.)')
    parser.add_argument('--country', default='SE', help='Landskod (SE, NO, DK, etc.)')
    parser.add_argument('--templates-only', action='store_true', help='Visa bara mallar, inte frågor')
    
    args = parser.parse_args()
    
    tester = RoaringKYCTester()
    
    if args.templates_only:
        if not tester.authenticate():
            sys.exit(1)
        tester.get_company_templates(args.language, args.country)
        tester.get_person_templates(args.language)
    else:
        tester.run_full_test(args.language, args.country)


if __name__ == '__main__':
    main()
