#!/usr/bin/env python3
import keyring
import os

# Get the Railway API token
token = keyring.get_password("memex", "RAILWAY_API_TOKEN_HABU_DASHBOARD")
if token:
    # Write token to temporary file for configure tool
    with open('/tmp/railway_token.txt', 'w') as f:
        f.write(token)
    print("✅ Railway token written to /tmp/railway_token.txt")
else:
    print("❌ No Railway token found")