#!/usr/bin/env python3
import keyring
import os

def get_railway_token():
    """Retrieve Railway API token from keyring."""
    try:
        token = keyring.get_password('memex', 'RAILWAY_API_TOKEN_HABU_DASHBOARD')
        
        if token and len(token) > 10:
            print("✅ Railway token retrieved successfully!")
            print(f"Token length: {len(token)} characters")
            
            # Save to secure temp file for Railway configuration
            with open('/tmp/railway_token', 'w') as f:
                f.write(token)
            os.chmod('/tmp/railway_token', 0o600)  # Secure permissions
            print("🔒 Token saved securely to /tmp/railway_token")
            return True
        else:
            print("❌ Railway token not found or invalid")
            return False
            
    except Exception as e:
        print(f"❌ Error retrieving token: {e}")
        return False

if __name__ == "__main__":
    success = get_railway_token()
    exit(0 if success else 1)