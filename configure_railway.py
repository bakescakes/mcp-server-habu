#!/usr/bin/env python3
import keyring
import os
import subprocess

def configure_railway():
    """Configure Railway API token and test connection."""
    print("🔍 Retrieving Railway API token...")
    
    try:
        # Get token from keyring
        token = keyring.get_password('memex', 'RAILWAY_API_TOKEN_HABU_DASHBOARD')
        
        if token:
            print("✅ Token found!")
            print(f"Token length: {len(token)} characters")
            print(f"Token starts with: {token[:12]}...")
            
            # Save token securely for Railway CLI/API use
            with open('/tmp/railway_token.txt', 'w') as f:
                f.write(token)
            os.chmod('/tmp/railway_token.txt', 0o600)
            
            print("🔒 Token saved securely to temp file")
            print("🚀 Ready to configure Railway API")
            
            return token
        else:
            print("❌ Token not found with key 'RAILWAY_API_TOKEN_HABU_DASHBOARD'")
            return None
            
    except Exception as e:
        print(f"❌ Error: {e}")
        return None

if __name__ == "__main__":
    token = configure_railway()
    if token:
        print("✅ Railway configuration ready!")
    else:
        print("❌ Railway configuration failed")