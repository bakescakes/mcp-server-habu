#!/bin/bash

# Navigate to the correct directory
cd /Users/scottbaker/Workspace/mcp_server_for_habu

# Check git status
echo "=== Git Status ==="
git status

# Check if there are commits to push
echo -e "\n=== Checking commits to push ==="
git log origin/main..HEAD --oneline

# Push to GitHub
echo -e "\n=== Pushing to GitHub ==="
git push origin main

echo -e "\n=== Push completed ==="