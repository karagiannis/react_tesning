#!/usr/bin/env python3
"""
Roaring.io Sanctions Lists 3.0 Test
====================================
KRITISK funktion för PTL-compliance!

Match på sanktionslista = OMEDELBAR AVVISNING (lagligt förbjudet att göra affärer)

Listor som kontrolleras:
- EU: Consolidated Financial Sanctions List
- OFAC (USA): 8 olika listor (SDN, CSL, FSE, SSI, etc.)
- UN: Security Council Consolidated List
- UK: OFSI Consolidated List
- Schweiz: SECO Sanctions List

Endpoints:
1. GET /global/sanctions-lists/3.0/search - Sök person/organisation/fartyg
2. GET /global/sanctions-lists/3.0/{referenceNumber} - Hämta specifik post
"""

import json
import sys
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Optional, Any

import requests
import sys
from pathlib import Path

# Add parent directory to path to import credentials
sys.path.insert(0, str(Path(__file__).parent.parent))
from credentials import get_oauth2_credentials


class RoaringSanctionsTester:
    """Test Roaring.io Sanctions Lists API."""
    
    def __init__(self):
        """Initialize med authentication."""
        self.base_url = 'https://api.roaring.io/global/sanctions-lists/3.0'
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
                return False
                
        except Exception as e:
            print(f"❌ Autentiseringsfel: {str(e)}")
            return False
    
    def _api_request(self, endpoint: str, params: Optional[Dict] = None) -> Optional[Dict]:
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
    
    def search_sanctions(
        self,
        name: str,
        sanction_org: Optional[str] = None,
        birth_date: Optional[str] = None,
        gender: Optional[str] = None,
        country: Optional[str] = None,
        entity_type: Optional[str] = None,
        fuzzy: bool = False,
        fuzzy_distance: Optional[int] = None,
        separate_name_search: bool = False
    ) -> Dict:
        """
        Sök i sanktionslistor.
        
        Args:
            name: Namn att söka efter (REQUIRED)
            sanction_org: Filtrera på organisation (EU, UN, OFAC, UKOFSI, CHSECO)
            birth_date: Födelsedatum (YYYY, YYYY-MM eller YYYY-MM-DD)
            gender: Kön (Male, Female, Unknown)
            country: Land
            entity_type: Typ (PERSON, ORGANISATION, OTHER)
            fuzzy: Aktivera fuzzy matching
            fuzzy_distance: 0, 1 eller 2 (default: AUTO)
            separate_name_search: Matcha något ord istället för alla ord
        """
        print(f"\n{'='*70}")
        print(f"🚫 Sanktionssökning: {name}")
        print(f"{'='*70}")
        
        params = {'name': name}
        
        if sanction_org:
            params['sanctionOrg'] = sanction_org
        if birth_date:
            params['birthDate'] = birth_date
        if gender:
            params['gender'] = gender
        if country:
            params['country'] = country
        if entity_type:
            params['entityType'] = entity_type
        if fuzzy:
            params['fuzzy'] = 'true'
        if fuzzy_distance is not None:
            params['fuzzyDistance'] = fuzzy_distance
        if separate_name_search:
            params['separateNameSearch'] = 'true'
        
        print(f"Sökparametrar: {params}")
        
        result = self._api_request('/search', params)
        
        if result and not result.get('error'):
            hit_count = result.get('hitCount', 0)
            hits = result.get('hits', [])
            metrics = result.get('metrics', {})
            
            if hit_count == 0:
                print(f"✅ Inga träffar - personen/företaget är INTE sanktionerad")
            else:
                print(f"🚨 SANKTIONSMATCH DETEKTERAD!")
                print(f"   Antal träffar: {hit_count}")
                
                # Visa metrics
                if metrics:
                    print(f"\n   📊 Metrics:")
                    if 'sanctionsOrganisation' in metrics:
                        print(f"      Listor: {metrics['sanctionsOrganisation']}")
                    if 'entityType' in metrics:
                        print(f"      Typer: {metrics['entityType']}")
                    if 'country' in metrics:
                        print(f"      Länder: {metrics['country']}")
                
                # Visa träffar
                print(f"\n   🎯 Träffar:")
                for idx, hit in enumerate(hits[:5], 1):  # Visa max 5 första
                    print(f"\n   Träff {idx}:")
                    print(f"      Ref: {hit.get('referenceNumber', 'N/A')}")
                    print(f"      Namn: {hit.get('name', 'N/A')}")
                    print(f"      Typ: {hit.get('entityType', 'N/A')}")
                    print(f"      Listor: {hit.get('sanctionsOrganisation', [])}")
                    print(f"      Search Score: {hit.get('searchScore', 'N/A')}")
                    
                    if hit.get('birthDate'):
                        print(f"      Födelsedat: {hit['birthDate']}")
                    if hit.get('aliases'):
                        print(f"      Alias: {hit['aliases'][:3]}")  # Max 3 alias
                    
                    # Listspecifika detaljer
                    details = hit.get('sanctionsListsDetails', [])
                    if details:
                        print(f"      Detaljer från {len(details)} lista(or)")
                
                if hit_count > 5:
                    print(f"\n   ... och {hit_count - 5} träffar till")
            
            return result
        else:
            print(f"❌ Sökning misslyckades")
            print(f"   Error: {result}")
            return result
    
    def get_by_reference(self, reference_number: str) -> Dict:
        """
        Hämta specifik sanktionspost via referensnummer.
        
        Args:
            reference_number: Referensnummer (t.ex. "EU.1234.12", "OFAC.88888")
        """
        print(f"\n{'='*70}")
        print(f"📋 Hämta sanktionspost: {reference_number}")
        print(f"{'='*70}")
        
        result = self._api_request(f'/{reference_number}')
        
        if result and not result.get('error'):
            records = result.get('records', [])
            status = result.get('status', {})
            
            print(f"Status: {status.get('text', 'N/A')} (kod: {status.get('code', 'N/A')})")
            print(f"Antal poster: {len(records)}")
            
            if records:
                for idx, record in enumerate(records, 1):
                    print(f"\n   Post {idx}:")
                    print(f"      Ref: {record.get('referenceNumber', 'N/A')}")
                    print(f"      Namn: {record.get('name', 'N/A')}")
                    print(f"      Typ: {record.get('entityType', 'N/A')}")
                    print(f"      Listor: {record.get('sanctionsOrganisation', [])}")
                    
                    if record.get('birthDate'):
                        print(f"      Födelsedat: {record['birthDate']}")
                    if record.get('aliases'):
                        print(f"      Alias: {', '.join(record['aliases'][:5])}")
                    
                    # Visa sanctionsListsDetails struktur
                    details = record.get('sanctionsListsDetails', [])
                    if details:
                        print(f"\n      📄 Listdetaljer ({len(details)} listor):")
                        for detail in details[:2]:  # Max 2 första
                            detail_type = detail.get('type', 'N/A')
                            org = detail.get('sanctionsOrganisation', 'N/A')
                            print(f"         - {org} (type: {detail_type})")
                            
                            # Visa några nyckelfält beroende på typ
                            if 'program' in detail:
                                print(f"           Program: {detail['program']}")
                            if 'listingReason' in detail:
                                reason = detail['listingReason'][:100]  # Max 100 chars
                                print(f"           Anledning: {reason}...")
            
            return result
        else:
            print(f"❌ Kunde inte hämta post")
            print(f"   Error: {result}")
            return result
    
    def run_sandbox_tests(self):
        """Kör igenom Roaring's sandbox-exempel."""
        print(f"\n{'#'*70}")
        print(f"# ROARING SANCTIONS LISTS - SANDBOX TESTS")
        print(f"# Timestamp: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print(f"{'#'*70}")
        
        if not self.authenticate():
            print("\n❌ Autentisering misslyckades. Avbryter.")
            return
        
        # Test 1: Inga träffar (rent namn)
        print(f"\n\n{'='*70}")
        print(f"TEST 1: Sökning som INTE ska ge träff (rent namn)")
        print(f"{'='*70}")
        self.search_sanctions("Lars Andersson", entity_type="PERSON")
        
        # Test 2: Person på alla 5 listor
        print(f"\n\n{'='*70}")
        print(f"TEST 2: Person på ALLA 5 sanktionslistor (Ztarz)")
        print(f"{'='*70}")
        result = self.search_sanctions("Ztarz")
        
        # Test 3: Kalle Kallesson (flera listor)
        print(f"\n\n{'='*70}")
        print(f"TEST 3: Kalle Kallesson (EU, OFAC, CHSECO, UK)")
        print(f"{'='*70}")
        self.search_sanctions("Kalle Kallesson", birth_date="1952")
        
        # Test 4: Specifikt EU-sanktionerad person
        print(f"\n\n{'='*70}")
        print(f"TEST 4: Sven Svensson (EU-specifik)")
        print(f"{'='*70}")
        self.search_sanctions(
            "Sven Svensson",
            sanction_org="EU",
            birth_date="1931-02-26"
        )
        
        # Test 5: Organisation på flera listor
        print(f"\n\n{'='*70}")
        print(f"TEST 5: AL-EVAB (organisation på 5 listor)")
        print(f"{'='*70}")
        self.search_sanctions("AL-EVAB", entity_type="ORGANISATION")
        
        # Test 6: Fartyg (OTHER)
        print(f"\n\n{'='*70}")
        print(f"TEST 6: RIRI (fartyg på OFAC, UKOFSI, CHSECO)")
        print(f"{'='*70}")
        self.search_sanctions("RIRI", entity_type="OTHER")
        
        # Test 7: Fuzzy search med separata ord
        print(f"\n\n{'='*70}")
        print(f"TEST 7: Fuzzy + Separate Name Search")
        print(f"{'='*70}")
        self.search_sanctions(
            "Mo Awade Sambad",
            sanction_org="EU, UN",
            fuzzy=True,
            separate_name_search=True
        )
        
        # Test 8: Hämta specifik post via referensnummer
        print(f"\n\n{'='*70}")
        print(f"TEST 8: Hämta via referensnummer (EU.1234.12)")
        print(f"{'='*70}")
        self.get_by_reference("EU.1234.12")
        
        print(f"\n{'='*70}")
        print(f"✅ SANDBOX TESTS KLARA")
        print(f"{'='*70}")
        
        # Spara ett exempel-resultat för inspektion
        print(f"\n💾 Sparar detaljerat exempel...")
        detailed_result = self.search_sanctions("Ztarz")
        if detailed_result and not detailed_result.get('error'):
            output_file = Path('roaring_sanctions_example_ztarz.json')
            with open(output_file, 'w', encoding='utf-8') as f:
                json.dump(detailed_result, f, indent=2, ensure_ascii=False)
            print(f"   Sparat i: {output_file}")


def main():
    """CLI entry point."""
    import argparse
    
    parser = argparse.ArgumentParser(description='Testa Roaring.io Sanctions Lists API')
    parser.add_argument('--sandbox', action='store_true', help='Kör sandbox-tests')
    parser.add_argument('--name', help='Sök specifikt namn')
    parser.add_argument('--birth-date', help='Födelsedatum (YYYY-MM-DD)')
    parser.add_argument('--entity-type', choices=['PERSON', 'ORGANISATION', 'OTHER'], help='Typ av entitet')
    parser.add_argument('--fuzzy', action='store_true', help='Aktivera fuzzy matching')
    parser.add_argument('--reference', help='Hämta via referensnummer')
    
    args = parser.parse_args()
    
    tester = RoaringSanctionsTester()
    
    if args.sandbox:
        tester.run_sandbox_tests()
    elif args.reference:
        if not tester.authenticate():
            sys.exit(1)
        tester.get_by_reference(args.reference)
    elif args.name:
        if not tester.authenticate():
            sys.exit(1)
        tester.search_sanctions(
            args.name,
            birth_date=args.birth_date,
            entity_type=args.entity_type,
            fuzzy=args.fuzzy
        )
    else:
        parser.print_help()


if __name__ == '__main__':
    main()
