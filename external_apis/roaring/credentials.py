#!/usr/bin/env python3
"""
Roaring.io Credentials Helper
==============================
Läser credentials från roaring.ini och exponerar dem som environment variables
eller Python-variabler.

Användning:
    # I Python script:
    from roaring_credentials import get_oauth2_credentials, get_api_key
    
    client_id, client_secret = get_oauth2_credentials()
    api_key = get_api_key(environment='sandbox')
    
    # I terminal (export som env vars):
    source <(python3 roaring_credentials.py export)
"""

import configparser
import os
import sys
from pathlib import Path


def get_config_path():
    """Hitta credentials.ini filen (tidigare roaring.ini)."""
    # Försök först i samma katalog som detta skript
    script_dir = Path(__file__).parent
    config_path = script_dir / 'credentials.ini'
    
    if config_path.exists():
        return config_path
    
    # Legacy fallback: sök efter roaring.ini
    config_path = script_dir / 'roaring.ini'
    if config_path.exists():
        return config_path
    
    # Försök i projekt root (för bakåtkompatibilitet)
    project_root = script_dir
    while project_root != project_root.parent:
        for filename in ['credentials.ini', 'roaring.ini']:
            config_path = project_root / filename
            if config_path.exists():
                return config_path
        project_root = project_root.parent
    
    raise FileNotFoundError(
        "Kunde inte hitta credentials.ini. Kontrollera att filen finns i external_apis/roaring/"
    )


def load_config():
    """Ladda konfiguration från roaring.ini."""
    config = configparser.ConfigParser()
    config_path = get_config_path()
    config.read(config_path)
    return config


def get_oauth2_credentials():
    """
    Hämta OAuth2 credentials.
    
    Returns:
        tuple: (client_id, client_secret, token_url)
    """
    config = load_config()
    
    client_id = config.get('oauth2', 'client_id')
    client_secret = config.get('oauth2', 'client_secret')
    token_url = config.get('oauth2', 'oauth_token_url')
    
    return client_id, client_secret, token_url


def get_api_key(environment='sandbox'):
    """
    Hämta API Key för X-API-Key header authentication.
    
    Args:
        environment (str): 'sandbox' eller 'production'
    
    Returns:
        str: API key
    
    Raises:
        ValueError: Om API key inte är konfigurerad
    """
    config = load_config()
    
    key_name = f'{environment}_key'
    api_key = config.get('api_keys', key_name)
    
    if api_key.startswith('<') or not api_key:
        raise ValueError(
            f"API key för {environment} är inte konfigurerad i roaring.ini. "
            f"Hämta nyckeln från Roaring developer portal och uppdatera filen."
        )
    
    return api_key


def get_base_url(environment='sandbox'):
    """
    Hämta base URL för specifik miljö.
    
    Args:
        environment (str): 'sandbox' eller 'production'
    
    Returns:
        str: Base URL
    """
    config = load_config()
    return config.get('endpoints', f'{environment}_base_url')


def get_endpoint_path(api_name):
    """
    Hämta endpoint path för specifik API.
    
    Args:
        api_name (str): Namnet på API:t (t.ex. 'company_info_api')
    
    Returns:
        str: Endpoint path
    """
    config = load_config()
    return config.get('endpoints', api_name)


def export_environment_variables():
    """
    Exportera credentials som environment variables.
    Skriver ut export-kommandon som kan source:as i bash.
    """
    try:
        client_id, client_secret, token_url = get_oauth2_credentials()
        
        print(f"export ROARING_CLIENT_ID='{client_id}'")
        print(f"export ROARING_CLIENT_SECRET='{client_secret}'")
        print(f"export ROARING_OAUTH_TOKEN_URL='{token_url}'")
        
        # Försök hämta API keys (om de finns)
        try:
            sandbox_key = get_api_key('sandbox')
            print(f"export ROARING_API_KEY_SANDBOX='{sandbox_key}'")
        except ValueError:
            print("# ROARING_API_KEY_SANDBOX saknas i roaring.ini", file=sys.stderr)
        
        try:
            prod_key = get_api_key('production')
            print(f"export ROARING_API_KEY_PROD='{prod_key}'")
        except ValueError:
            print("# ROARING_API_KEY_PROD saknas i roaring.ini", file=sys.stderr)
        
    except Exception as e:
        print(f"# Fel vid läsning av roaring.ini: {e}", file=sys.stderr)
        sys.exit(1)


def print_credentials_summary():
    """Skriv ut en sammanfattning av credentials status."""
    config = load_config()
    
    print("=" * 60)
    print("ROARING.IO CREDENTIALS SUMMARY")
    print("=" * 60)
    print()
    
    # OAuth2
    print("📝 OAuth2 Credentials:")
    client_id, client_secret, token_url = get_oauth2_credentials()
    print(f"   Client ID:     {client_id[:20]}..." if len(client_id) > 20 else f"   Client ID:     {client_id}")
    print(f"   Client Secret: {client_secret[:20]}..." if len(client_secret) > 20 else f"   Client Secret: {client_secret}")
    print(f"   Token URL:     {token_url}")
    print(f"   Status:        {config.get('status', 'oauth2_working')}")
    print()
    
    # API Keys
    print("🔑 API Keys:")
    for env in ['sandbox', 'production']:
        try:
            key = get_api_key(env)
            print(f"   {env.capitalize():12} {'✅ Konfigurerad' if not key.startswith('<') else '❌ Saknas'}")
        except ValueError:
            print(f"   {env.capitalize():12} ❌ Saknas")
    print()
    
    # Endpoints
    print("🌐 Endpoints:")
    print(f"   Sandbox:    {config.get('endpoints', 'sandbox_base_url')}")
    print(f"   Production: {config.get('endpoints', 'production_base_url')}")
    print()
    
    # Authentication guide
    print("🔐 Authentication Methods per API:")
    auth_guide = dict(config.items('authentication_guide'))
    for api, method in auth_guide.items():
        print(f"   {api:25} → {method}")
    print()
    
    # Status notes
    print("⚠️  Status Notes:")
    if config.has_section('notes'):
        for key, value in config.items('notes'):
            print(f"   • {value}")
    print()
    print("=" * 60)


def main():
    """Main function."""
    if len(sys.argv) > 1:
        if sys.argv[1] == 'export':
            export_environment_variables()
        elif sys.argv[1] == 'summary':
            print_credentials_summary()
        elif sys.argv[1] == 'oauth2':
            client_id, client_secret, token_url = get_oauth2_credentials()
            print(f"CLIENT_ID: {client_id}")
            print(f"CLIENT_SECRET: {client_secret}")
            print(f"TOKEN_URL: {token_url}")
        elif sys.argv[1] == 'api-key':
            env = sys.argv[2] if len(sys.argv) > 2 else 'sandbox'
            try:
                api_key = get_api_key(env)
                print(api_key)
            except ValueError as e:
                print(f"Error: {e}", file=sys.stderr)
                sys.exit(1)
        else:
            print("Usage:")
            print("  python3 roaring_credentials.py summary      # Visa credentials status")
            print("  python3 roaring_credentials.py export       # Exportera som env vars")
            print("  python3 roaring_credentials.py oauth2       # Visa OAuth2 credentials")
            print("  python3 roaring_credentials.py api-key [env] # Visa API key (sandbox/production)")
            sys.exit(1)
    else:
        print_credentials_summary()


if __name__ == '__main__':
    main()
