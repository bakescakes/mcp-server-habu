#!/usr/bin/env python3
import keyring

# Try to get the Railway API token
token_names = ['RAILWAY_API_TOKEN_HABU_DASHBOARD', 'RAILWAY_TOKEN', 'RAILWAY_API_TOKEN']

railway_token = None
for token_name in token_names:
    try:
        token = keyring.get_password("memex", token_name)
        if token:
            railway_token = token
            print(f"SUCCESS: {token_name}")
            # Set environment variable and use configure tool
            break
    except Exception as e:
        print(f"FAILED: {token_name} - {e}")

if not railway_token:
    print("ERROR: No Railway token found")
    exit(1)