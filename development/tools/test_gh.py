#!/usr/bin/env python3
import keyring
import os
import subprocess
import json

def test_github_cli():
    """Test GitHub CLI with stored token."""
    try:
        # Get token from keyring
        token = keyring.get_password('memex', 'GITHUB_CLI_GH_TOKEN')
        if not token:
            print("❌ GitHub token not found in keyring")
            return False
            
        print("✅ GitHub token found")
        
        # Set token as environment variable for gh
        env = os.environ.copy()
        env['GITHUB_TOKEN'] = token
        
        # Test 1: Check GitHub CLI version
        print("🔍 Testing GitHub CLI version...")
        result = subprocess.run(['/opt/homebrew/bin/gh', '--version'], 
                              capture_output=True, text=True, env=env)
        if result.returncode == 0:
            print("✅ GitHub CLI version:", result.stdout.split('\n')[0])
        else:
            print("❌ Version check failed:", result.stderr)
            return False
            
        # Test 2: View repository info (safe, read-only)
        print("🔍 Testing repository view...")
        result = subprocess.run(['/opt/homebrew/bin/gh', 'repo', 'view', 'bakescakes/mcp-server-habu', 
                               '--json', 'name,description,defaultBranch,isPrivate'], 
                              capture_output=True, text=True, env=env)
        
        if result.returncode == 0:
            repo_info = json.loads(result.stdout)
            print("✅ Repository info retrieved:")
            print(f"   📁 Name: {repo_info['name']}")
            print(f"   📝 Description: {repo_info['description'][:80]}...")
            print(f"   🌿 Default branch: {repo_info['defaultBranch']}")
            print(f"   🔒 Private: {repo_info['isPrivate']}")
        else:
            print("❌ Repository view failed:", result.stderr)
            return False
            
        # Test 3: List recent commits (safe, read-only)  
        print("🔍 Testing commit history...")
        result = subprocess.run(['/opt/homebrew/bin/gh', 'api', 'repos/bakescakes/mcp-server-habu/commits', 
                               '--jq', '.[0:3] | .[] | {sha: .sha[0:7], message: .commit.message | split("\\n")[0], date: .commit.author.date}'], 
                              capture_output=True, text=True, env=env)
        
        if result.returncode == 0:
            print("✅ Recent commits:")
            for line in result.stdout.strip().split('\n'):
                if line.strip():
                    try:
                        commit = json.loads(line)
                        print(f"   🔹 {commit['sha']}: {commit['message'][:50]}...")
                    except:
                        pass
        else:
            print("❌ Commit history failed:", result.stderr)
            
        print("🎉 GitHub CLI is working perfectly!")
        return True
        
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

if __name__ == "__main__":
    test_github_cli()