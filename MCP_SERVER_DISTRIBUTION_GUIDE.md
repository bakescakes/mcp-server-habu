# 📦 MCP Server for Habu - Distribution Guide

## 🎯 Quick Start for Colleagues

This guide helps you set up the **MCP Server for Habu Clean Room API** on your local machine. The server provides 45 comprehensive tools for managing clean rooms, data connections, partner collaboration, and analytics execution.

---

## 📋 Prerequisites

### Required Software
- **Node.js**: v18 or higher ([Download here](https://nodejs.org/))
- **npm**: Comes with Node.js
- **Git**: For version control ([Download here](https://git-scm.com/))

### Required Credentials
You'll need **Habu Clean Room API credentials**:
- `CLIENT_ID` - OAuth2 client ID
- `CLIENT_SECRET` - OAuth2 client secret

*Contact your Habu administrator or the person who shared this bundle for credentials.*

---

## 🚀 Installation Steps

### Step 1: Extract and Navigate
```bash
# Extract the bundle and navigate to the directory
cd mcp-habu-runner
```

### Step 2: Install Dependencies
```bash
# Install all Node.js dependencies
npm install
```

### Step 3: Configure Environment
```bash
# Copy the template environment file
cp .env.template .env

# Edit .env with your credentials
nano .env  # or use your preferred editor
```

**Edit `.env` file with your credentials:**
```bash
# Habu API Configuration
HABU_API_BASE_URL=https://api.habu.com/v1

# OAuth2 Credentials (REQUIRED - Get from your Habu admin)
CLIENT_ID=your_client_id_here
CLIENT_SECRET=your_client_secret_here

# Mode Configuration
USE_REAL_API=true

# Optional: Test Resources (can leave as-is for initial setup)
TARGET_CLEANROOM_DISPLAY_ID=CR-045487
TARGET_QUESTION_DISPLAY_ID=CRQ-138038
```

### Step 4: Build the Server
```bash
# Compile TypeScript to JavaScript
npm run build
```

### Step 5: Test the Server
```bash
# Quick connectivity test
node test-oauth.js
```

**Expected output:**
```
✅ OAuth2 authentication successful
✅ API connection verified
🎉 Server ready for MCP integration
```

---

## 🔧 MCP Client Integration

### Option 1: Claude Desktop Integration

Add to your Claude Desktop configuration (`%AppData%\Claude\claude_desktop_config.json` on Windows or `~/Library/Application Support/Claude/claude_desktop_config.json` on macOS):

```json
{
  "mcpServers": {
    "habu-cleanroom": {
      "command": "node",
      "args": ["/FULL/PATH/TO/mcp-habu-runner/dist/index.js"],
      "env": {
        "CLIENT_ID": "your_client_id_here",
        "CLIENT_SECRET": "your_client_secret_here",
        "USE_REAL_API": "true"
      }
    }
  }
}
```

**⚠️ Important**: Replace `/FULL/PATH/TO/` with the actual absolute path to your installation.

### Option 2: Other MCP Clients

For other MCP-compatible clients (Memex, Cline, etc.), use similar configuration with:
- **Command**: `node`
- **Args**: `["/path/to/mcp-habu-runner/dist/index.js"]`
- **Environment**: Your credentials as shown above

---

## ✅ Verification Steps

### 1. Test MCP Connection
In your MCP client, try:
```
Use the test_connection tool to verify API connectivity
```

**Expected result**: ✅ Success with authentication confirmation

### 2. List Available Clean Rooms
```
Use the list_cleanrooms tool to see available clean rooms
```

**Expected result**: List of clean rooms you have access to

### 3. Test a Simple Tool
```
Use the list_credentials tool to see available organization credentials
```

**Expected result**: List of configured data connection credentials

---

## 🛠️ Available Tools Overview

The server provides **45 comprehensive tools** organized in categories:

### 🏢 **Clean Room Management** (8 tools)
- Create, configure, monitor, and manage clean room lifecycle
- Health monitoring and access auditing
- Advanced lifecycle management

### 🔌 **Data Connections** (14 tools) 
- **Multi-cloud wizards**: AWS S3, Google Cloud, Azure, Snowflake
- **Specialized platforms**: BigQuery, Databricks, Amazon Marketing Cloud
- **CRM integrations**: HubSpot, Salesforce
- **Enterprise features**: Data sharing, secure views

### 👥 **Partner Collaboration** (7 tools)
- Partner invitations and onboarding workflows
- Granular permission management
- Multi-partner setup coordination

### 📊 **Question & Analytics Management** (8 tools)
- Question deployment and configuration
- Automated execution and scheduling
- Results access and export workflows

### 🚀 **Advanced Features** (8 tools)
- Execution templates and workflow automation
- Advanced user management and bulk operations
- Data export and transformation workflows

---

## 🔧 Troubleshooting

### Common Issues

#### **"Authentication failed" errors**
1. Verify `CLIENT_ID` and `CLIENT_SECRET` in `.env` file
2. Ensure credentials are from your Habu administrator
3. Test with: `node test-oauth.js`

#### **"Module not found" errors**
1. Run `npm install` to install dependencies
2. Run `npm run build` to compile TypeScript
3. Check Node.js version: `node --version` (should be v18+)

#### **MCP client doesn't recognize server**
1. Verify absolute path in MCP configuration
2. Restart your MCP client after configuration changes
3. Check that `dist/index.js` exists after building

#### **Tools return mock data instead of real API data**
1. Ensure `USE_REAL_API=true` in `.env` file
2. Verify API credentials are correct
3. Test connectivity with `test_connection` tool

### Debug Scripts

The bundle includes several debug scripts for troubleshooting:

```bash
# Test OAuth2 authentication
node test-oauth.js

# Test API connectivity
node test-api.js

# Test with hybrid mode (mock fallbacks)
node test-hybrid.js

# Test MCP tool integration
node test-mcp.js
```

---

## 📁 Bundle Contents

```
mcp-habu-runner/
├── src/                     # TypeScript source code
│   ├── index.ts            # Main production server (45 tools)
│   ├── production-index.ts # Enhanced production server
│   ├── hybrid-index.ts     # Development server with mock fallbacks
│   └── auth.ts             # OAuth2 authentication logic
├── dist/                   # Compiled JavaScript (generated after build)
├── package.json           # Node.js dependencies and scripts
├── tsconfig.json          # TypeScript configuration
├── .env.template          # Environment configuration template
├── README.md              # Local setup documentation
└── test-*.js              # Debug and testing scripts
```

---

## 🔒 Security Notes

### Credential Management
- **Never commit `.env` files** to version control
- **Use environment variables** in production deployments
- **Rotate credentials regularly** as per your organization's policy

### API Usage
- The server connects to **production Habu API**
- All operations affect **real clean rooms and data**
- Test with caution and verify permissions

---

## 📞 Support & Resources

### Getting Help
1. **API Documentation**: Included `Clean_Room-Complete-Documentation-June-2025.pdf`
2. **Tool Reference**: See `MCP_TOOLS_REFERENCE.md` for complete tool documentation
3. **Technical Details**: See `MCP_TOOLS_REFERENCE_DETAILED.md` for implementation details
4. **Testing Guide**: See `MCP_TOOL_TESTING_STATUS.md` for validation status

### Contact
- **Bundle Creator**: [Contact person who shared this bundle]
- **Habu Support**: [Your organization's Habu admin contact]
- **Technical Issues**: Document issues and share with the development team

---

## 🎉 You're Ready!

Once setup is complete, you'll have access to:
- ✅ **45 comprehensive MCP tools** for clean room management
- ✅ **Multi-cloud data connection** capabilities
- ✅ **Complete partner collaboration** workflows  
- ✅ **Automated analytics execution** and monitoring
- ✅ **Real-time API integration** with production Habu environment

**First recommended action**: Try the `test_connection` tool to verify everything is working correctly!

---

*Last Updated: January 2025*  
*Version: Production Ready v1.0*  
*Bundle Distribution Guide*