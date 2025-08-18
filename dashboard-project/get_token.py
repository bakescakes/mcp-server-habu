#!/usr/bin/env python3
import keyring
import sys
import os

def get_github_token():
    """Retrieve GitHub token from keyring."""
    try:
        # Try exact case first
        token = keyring.get_password('memex', 'GITHUB_CLI_GH_TOKEN')
        if not token:
            # Try lowercase
            token = keyring.get_password('memex', 'github_cli_gh_token')
        if not token:
            # Try other variations
            token = keyring.get_password('memex', 'GitHub_CLI_GH_TOKEN')
        
        if token and len(token) > 20:  # Basic validation without revealing token
            return token
        else:
            return None
    except Exception as e:
        print(f"Error retrieving token: {e}", file=sys.stderr)
        return None

if __name__ == "__main__":
    token = get_github_token()
    if token:
        print("TOKEN_FOUND")
        # Write to a temporary file for git credential helper
        with open('/tmp/github_token', 'w') as f:
            f.write(token)
        os.chmod('/tmp/github_token', 0o600)  # Secure permissions
        print("TOKEN_SAVED")
    else:
        print("TOKEN_NOT_FOUND")
        sys.exit(1)