#!/usr/bin/env python3
import subprocess
import sys
import os

def push_to_github():
    """Push to GitHub using stored token."""
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
            
        # First, pull any remote changes
        print("Pulling remote changes...")
        result = subprocess.run(['git', 'pull', 'origin', 'main', '--rebase'], 
                              capture_output=True, text=True)
        if result.returncode != 0:
            print(f"Warning: Pull failed: {result.stderr}")
            # Continue anyway, might be a new repo
            
        # Push to GitHub
        print("Pushing to GitHub...")
        result = subprocess.run(['git', 'push', 'origin', 'main'], 
                              capture_output=True, text=True)
        
        # Reset remote URL to remove token
        subprocess.run(['git', 'remote', 'set-url', 'origin', 
                       'https://github.com/bakescakes/mcp-server-habu.git'], 
                      capture_output=True)
        
        if result.returncode == 0:
            print("✅ Successfully pushed to GitHub!")
            print(result.stdout)
            return True
        else:
            print(f"❌ Failed to push: {result.stderr}")
            return False
            
    except Exception as e:
        print(f"Error: {e}")
        return False
    finally:
        # Clean up token file
        if os.path.exists('/tmp/github_token'):
            os.remove('/tmp/github_token')

if __name__ == "__main__":
    success = push_to_github()
    sys.exit(0 if success else 1)