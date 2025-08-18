# Railway Environment Variable Configuration

## GitHub Token Configuration

The backend has been updated to support GitHub API authentication. To complete the private repo integration:

### Manual Railway Configuration Required:

1. **Navigate to Railway Dashboard**: https://railway.app/dashboard
2. **Select Project**: "empowering-eagerness" 
3. **Select Service**: "mcp-server-habu"
4. **Go to Variables tab**
5. **Add Environment Variable**:
   - **Name**: `GITHUB_TOKEN`
   - **Value**: `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`

### Service Details:
- **Project ID**: `9e916066-b1d6-4cea-9143-56b168c38d50`
- **Service ID**: `202da808-8534-4b59-95f7-265537d64956` 
- **Environment ID**: `d433feea-a184-4a69-9366-d1924e8909fd`
- **Service URL**: `https://mcp-server-habu-production.up.railway.app`

### Current Status:
- ✅ Backend code updated to fetch from GitHub API
- ✅ Authentication support added
- ✅ Fallback to local file implemented
- ✅ Changes committed and pushed to trigger deployment
- ⏳ **GITHUB_TOKEN environment variable needs to be added manually**

### Testing After Configuration:
```bash
curl -s "https://mcp-server-habu-production.up.railway.app/api/status" | jq -r '._api'
```

Expected result should show:
- `source: "GitHub API"`
- `authenticated: true`
- `repository: "bakescakes/mcp-server-habu"`