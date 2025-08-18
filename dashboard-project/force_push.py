#!/usr/bin/env python3
import subprocess
import sys
import os

def force_push_dashboard():
    """Force push dashboard changes to GitHub."""
    try:
        # Read the token from the temporary file
        with open('/tmp/github_token', 'r') as f:
            token = f.read().strip()
        
        if not token:
            print("No token found")
            return False
            
        # Configure git remote URL with token
        username = "bakescakes"
        repo_url = f"https://{username}:{token}@github.com/bakescakes/mcp-server-habu.git"
        
        # Set the remote URL temporarily
        result = subprocess.run(['git', 'remote', 'set-url', 'origin', repo_url], 
                              capture_output=True, text=True)
        if result.returncode != 0:
            print(f"Failed to set remote URL: {result.stderr}")
            return False
        
        print("Checking current status...")
        subprocess.run(['git', 'status', '--porcelain'], check=False)
            
        # Force push to GitHub (this will overwrite remote changes)
        print("Force pushing to GitHub...")
        result = subprocess.run(['git', 'push', 'origin', 'main', '--force'], 
                              capture_output=True, text=True)
        
        # Reset remote URL to remove token
        subprocess.run(['git', 'remote', 'set-url', 'origin', 
                       'https://github.com/bakescakes/mcp-server-habu.git'], 
                      capture_output=True)
        
        if result.returncode == 0:
            print("✅ Successfully force pushed to GitHub!")
            print(result.stdout)
            return True
        else:
            print(f"❌ Failed to force push: {result.stderr}")
            return False
            
    except Exception as e:
        print(f"Error: {e}")
        return False
    finally:
        # Clean up token file
        if os.path.exists('/tmp/github_token'):
            os.remove('/tmp/github_token')

if __name__ == "__main__":
    success = force_push_dashboard()
    sys.exit(0 if success else 1)