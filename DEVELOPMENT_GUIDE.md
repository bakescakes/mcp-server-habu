# 🔧 MCP Server for Habu - Development Guide

**Complete guide for developers working on the MCP Server for Habu project**

---

## 📖 Table of Contents

1. [🚀 Quick Start](#-quick-start)
2. [⚙️ Environment Setup](#️-environment-setup)
3. [🧪 Testing Workflow](#-testing-workflow)
4. [📊 MCP Server Configuration](#-mcp-server-configuration)
5. [📱 React Website Integration](#-react-website-integration)
6. [🎮 Interactive Features](#-interactive-features)
7. [📦 Distribution & Deployment](#-distribution--deployment)
8. [🛠️ Troubleshooting](#️-troubleshooting)
9. [📋 Development Rules & Best Practices](#-development-rules--best-practices)

---

## 🚀 Quick Start

### Prerequisites
- **Node.js**: v18+ with npm/yarn
- **TypeScript**: Latest version
- **Python**: 3.8+ (for development tools)
- **Git**: For version control

### Initial Setup
```bash
# Clone repository
git clone <repository-url>
cd mcp_server_for_habu

# Setup MCP server
cd mcp-habu-runner
npm install
npm run build

# Setup Python environment (for development tools)
cd ..
python -m venv .venv
source .venv/bin/activate  # or .venv\Scripts\activate on Windows
pip install -e .
```

### Environment Configuration
Create `mcp-habu-runner/.env` with:
```bash
# Authentication (REQUIRED)
CLIENT_ID=your_client_id
CLIENT_SECRET=your_client_secret

# API Configuration
HABU_API_BASE_URL=https://api.habu.com/v1
USE_REAL_API=true

# Testing Configuration
TARGET_CLEANROOM_DISPLAY_ID=CR-045487
TARGET_QUESTION_DISPLAY_ID=CRQ-138038
```

---

## ⚙️ Environment Setup

### MCP Server Configuration

The MCP server requires configuration in your MCP client (Claude, Memex, etc.):

```json
{
  "mcpServers": {
    "habu-cleanroom": {
      "command": "node",
      "args": ["/path/to/mcp-habu-runner/dist/index.js"],
      "env": {
        "CLIENT_ID": "your_client_id",
        "CLIENT_SECRET": "your_client_secret",
        "HABU_API_BASE_URL": "https://api.habu.com/v1",
        "USE_REAL_API": "true"
      }
    }
  }
}
```

### Development vs Production Modes

#### **Production Mode** (Default)
- **File**: `mcp-habu-runner/src/index.ts`
- **Features**: Real API integration, OAuth2 authentication
- **Use**: Live development, testing, production

#### **Hybrid Mode** (Development)
- **File**: `mcp-habu-runner/src/hybrid-index.ts`
- **Features**: Mock fallbacks when API unavailable
- **Use**: Development when API access is limited

### Building the Server
```bash
cd mcp-habu-runner
npm run build  # Compiles TypeScript to dist/
```

---

## 🧪 Testing Workflow

### **NEW STREAMLINED WORKFLOW** ✅
*After documentation overhaul - single file updates*

#### After Testing Session:
```bash
1. Fix code issues in mcp-habu-runner/src/
2. Update CURRENT_STATUS.md ONLY:
   - Add tool to "✅ Tested Tools" table
   - Update progress counters
   - Update "Next Tool" section
   - Add any issues to "Known Issues" section
3. Update MCP_TOOLS_REFERENCE_DETAILED.md IF technical details changed
4. Commit: "🧪 TEST COMPLETE: [tool_name] - [result]"
```

#### **MCP Server Restart Rule** 🚨
**ALWAYS restart the MCP server first** when tools aren't working as expected:
```bash
# Quick restart process
mcp_toggle_server("habu-cleanroom", false)  # Disable
mcp_toggle_server("habu-cleanroom", true)   # Enable
# Then test tool functionality
```

**When to restart**:
- After code changes (server caches compiled code)
- Tool returning old responses 
- 404 errors on working endpoints
- Environment variable changes
- "Tool not working" reports

### Testing Best Practices

#### **Real API Validation**
- All tests run against live Habu API
- Use production cleanroom CR-045487
- Verify business impact, not just API responses
- Document actual API behavior and limitations

#### **Test Evidence Requirements**
- Real API responses with timestamps
- Business impact verification (e.g., partner counts changed)
- Error scenarios with actual error messages
- Performance observations (response times, timeouts)

---

## 📊 MCP Server Configuration

### Server Architecture

#### **Core Files**:
- **`src/index.ts`**: Production server (45 tools)
- **`src/auth.ts`**: OAuth2 authentication
- **`src/hybrid-index.ts`**: Development server with mocks
- **`package.json`**: Dependencies and build scripts

#### **Tool Categories** (45 Total):
```typescript
{
  foundation: 8,           // Authentication, listing, basic operations
  cleanRoomManagement: 4,  // Create, configure, monitor clean rooms
  dataConnections: 14,     // Multi-cloud data connection wizards
  partnerCollaboration: 4, // Invitations, permissions, onboarding  
  questionManagement: 4,   // Deploy, execute, schedule questions
  datasetManagement: 4,    // Dataset provisioning and permissions
  resultsAndMonitoring: 4, // Results access, exports, monitoring
  advancedFeatures: 3      // Templates, user management, audit
}
```

#### **Detailed Tool Breakdown**:

##### **Foundation Tools (8 tools)**
- `test_connection` - OAuth2 authentication testing
- `list_cleanrooms` - Comprehensive clean room listing
- `list_questions` - Question discovery and browsing
- `configure_data_connection_fields` - Intelligent field mapping
- `complete_data_connection_setup` - End-to-end connection automation
- `create_aws_s3_connection` - AWS S3 data integration
- `start_aws_s3_connection_wizard` - Interactive AWS S3 setup
- `start_clean_room_creation_wizard` - Complete clean room creation

##### **Partner Collaboration Workflows (4 tools)**
- `invite_partner_to_cleanroom` - Guided partner invitation
- `manage_partner_invitations` - Invitation lifecycle management
- `configure_partner_permissions` - Role-based access controls
- `partner_onboarding_wizard` - End-to-end partner coordination

##### **Question Management Workflows (4 tools)**
- `deploy_question_to_cleanroom` - Question deployment with mapping
- `question_management_wizard` - Interactive question configuration
- `manage_question_permissions` - Granular question access controls
- `question_scheduling_wizard` - Automated execution scheduling

##### **Dataset Management Workflows (4 tools)**
- `provision_dataset_to_cleanroom` - Dataset provisioning with controls
- `dataset_configuration_wizard` - Interactive dataset-question mapping
- `manage_dataset_permissions` - Field-level access management
- `dataset_transformation_wizard` - Data transformation and derived fields

##### **Advanced Execution & Results (4 tools)**
- `execute_question_run` - Real-time question execution
- `check_question_run_status` - Point-in-time status checking
- `results_access_and_export` - Multi-format result processing
- `scheduled_run_management` - Recurring execution automation

##### **Clean Room Lifecycle Management (4 tools)**
- `update_cleanroom_configuration` - Configuration management with validation
- `cleanroom_health_monitoring` - Performance and health analytics
- `cleanroom_lifecycle_manager` - Archive/reactivate/cleanup operations
- `cleanroom_access_audit` - Security and compliance audit logging

##### **Multi-Cloud Data Connections (14 tools)**
- `start_aws_s3_connection_wizard` - Interactive AWS S3 setup
- `create_snowflake_connection_wizard` - Interactive Snowflake integration
- `create_databricks_connection_wizard` - Databricks with Delta Lake support
- `create_gcs_connection_wizard` - Google Cloud Storage with BigQuery
- `create_azure_connection_wizard` - Azure AD with Synapse integration
- `create_bigquery_connection_wizard` - Google BigQuery direct connection
- `create_google_ads_data_hub_wizard` - Google Ads Data Hub integration
- `create_amazon_marketing_cloud_wizard` - Amazon Marketing Cloud setup
- `create_snowflake_data_share_wizard` - Snowflake Data Share connections
- `create_snowflake_secure_views_wizard` - Snowflake Secure Views with privacy controls
- `create_hubspot_connection_wizard` - HubSpot CRM integration
- `create_salesforce_connection_wizard` - Salesforce CRM integration
- `data_connection_health_monitor` - Cross-cloud connection monitoring
- `complete_data_connection_setup` - Automated field mapping and setup

##### **Advanced Features (3 tools)**
- `data_export_workflow_manager` - Complete export job lifecycle with multi-destination support
- `execution_template_manager` - Reusable execution templates for complex workflow automation
- `advanced_user_management` - Bulk user operations, role management, and enterprise administration

### Authentication System

#### **OAuth2 Client Credentials Flow**:
```typescript
const tokenResponse = await axios.post('/oauth/token', {
  grant_type: 'client_credentials'
}, {
  auth: {
    username: CLIENT_ID,
    password: CLIENT_SECRET
  }
});
```

#### **Error Handling Pattern**:
```typescript
try {
  // API call
} catch (error) {
  return {
    success: false,
    error: error.message,
    debugInfo: {
      endpoint: '/api/endpoint',
      method: 'POST',
      statusCode: error.response?.status,
      suggestion: "Try restarting MCP server first"
    }
  };
}
```

---

## 📱 React Website Integration

> ⚠️ **STATUS INFORMATION DEPRECATED**  
> Status information in this section may be outdated (shows 24% tested, actual is 27%).  
> **For current accurate status**: See [CURRENT_STATUS.md](./CURRENT_STATUS.md)

### **Primary Data Sources for React Website**

#### **1. STATUS.json** 🥇 *[Real-time Project Status - Will be AUTO-GENERATED]*
- **Purpose**: Machine-readable project status for automated consumption
- **Update**: Will be automatically generated from CURRENT_STATUS.md
- **React Integration**: Poll this file for current statistics and status

#### **2. CURRENT_STATUS.md** 🥈 *[Human-readable master status]*  
- **Purpose**: Single source of truth with rich context
- **Update**: Manual updates after testing sessions
- **React Integration**: Can parse structured tables for advanced features

### **API Endpoint Mappings**
```javascript
// React API endpoints → Documentation sources
{
  "/api/status": "CURRENT_STATUS.md ## Project Status",
  "/api/tools": "CURRENT_STATUS.md ## Tool Testing Progress", 
  "/api/issues": "CURRENT_STATUS.md ## Known Issues",
  "/api/achievements": "CURRENT_STATUS.md ## Recent Achievements"
}
```

### **Data Format Examples**
```json
{
  "project": {
    "phase": "Production Ready - Testing Validation",
    "status": "Stable",
    "nextMilestone": "Complete tool validation"
  },
  "tools": {
    "tested": 12,
    "total": 45,
    "progress": 27
  },
  "testing": {
    "nextTool": "scheduled_run_management",
    "environment": "Production CR-045487",
    "successRate": "100%"
  }
}
```

---

## 🎮 Interactive Features

### **MCP Tool Wizards**
Many tools implement step-by-step wizards:

#### **Pattern**: Multi-step configuration
```typescript
// Example: start_aws_s3_connection_wizard
{
  step: "start" | "connection_info" | "credentials" | "configuration" | "review" | "create",
  connectionName: string,
  s3BucketPath: string,
  // ... other parameters collected step by step
}
```

#### **User Experience**:
- **Progressive disclosure**: Collect information step by step
- **Validation**: Each step validates before proceeding  
- **Context preservation**: Parameters flow between steps
- **Error recovery**: Clear guidance on validation failures

### **Intelligent Parameter Detection**
Tools automatically detect and suggest parameters:

#### **Example**: Question execution with partition detection
```typescript
// execute_question_run automatically detects date range requirements
{
  questionId: "CRQ-138038",
  partitionParameters: [
    { name: "exposures.date_start", value: "2024-01-01" },
    { name: "exposures.date_end", value: "2024-12-31" }
  ]
}
```

---

## 📦 Distribution & Deployment

### **MCP Server Distribution**

#### **Build Output**:
- **Primary**: `mcp-habu-runner/dist/index.js`
- **Dependencies**: All dependencies in node_modules
- **Configuration**: Environment variables for authentication

#### **Distribution Package**:
```
habu-mcp-server-package/
├── dist/
│   └── index.js                 # Compiled server
├── node_modules/               # Dependencies
├── package.json               # Configuration
├── .env.template             # Environment template
└── README.md                 # Setup instructions
```

### **Deployment Process**

#### **1. Build Verification**:
```bash
cd mcp-habu-runner
npm run build  # Must succeed without errors
npm test       # Run any available tests
```

#### **2. Environment Setup**:
- Verify all required environment variables
- Test authentication with `test_connection` tool
- Validate API connectivity

#### **3. MCP Integration**:
- Install in MCP client configuration
- Test basic tools (test_connection, list_cleanrooms)
- Verify error handling and logging

---

## 🛠️ Troubleshooting

### **Common Issues**

#### **🚨 MCP Server Issues - RESTART FIRST!**
**Rule #1**: When MCP tools aren't working, **ALWAYS restart MCP server first**

```bash
# Quick restart
mcp_toggle_server("habu-cleanroom", false)
mcp_toggle_server("habu-cleanroom", true)
```

#### **Authentication Problems**
- **Symptoms**: 401 errors, "authentication failed"
- **Solutions**:
  1. Verify CLIENT_ID and CLIENT_SECRET in MCP config
  2. Check .env file has correct OAuth2 credentials  
  3. Test with test_connection() tool

#### **API Endpoint Issues**
- **Symptoms**: 404 errors, endpoint not found
- **Solutions**:
  1. **Restart MCP server first!**
  2. Verify endpoint in manual testing scripts
  3. Check ID resolution (Display ID vs UUID vs name)

#### **Question Execution Issues** 
- **Symptoms**: Questions not triggering, timeout errors
- **Solutions**:
  1. Include required partition parameters (date ranges)
  2. Set monitorExecution: false (questions take 15-30+ minutes)
  3. Use proper date formats: "YYYY-MM-DD"

### **Debugging Workflow**

#### **When Code Changes Don't Work**:
1. **RESTART MCP SERVER FIRST**
2. Verify `npm run build` completed without errors
3. Check git commits to ensure changes were saved
4. Test manually with debug scripts

#### **When APIs Fail**:
1. Test with manual scripts first (e.g., `node test-oauth.js`)
2. Check authentication with test_connection() tool
3. Verify endpoints with Habu API documentation
4. Check rate limiting and API quotas

---

## 📋 Development Rules & Best Practices

### **Git Workflow**
- **Main Branch**: `main` (production-ready code only)
- **Feature Branches**: For new tool development
- **Commit Standards**: Descriptive messages with context
- **Commit Suffix**: `\n\n🤖 Generated with [Memex](https://memex.tech)\nCo-Authored-By: Memex <noreply@memex.tech>`

### **Code Standards**

#### **TypeScript Standards**:
- **Target**: ES2020+ with Node.js compatibility
- **Formatting**: Prettier with 2-space indentation
- **Naming**: camelCase for variables/functions, UPPER_CASE for constants
- **Async**: Prefer async/await over Promises

#### **Error Handling Requirements**:
- **Never Silent Fail**: Always return error information
- **Context Rich**: Include endpoint, method, parameters in errors
- **User Friendly**: Provide actionable error messages
- **Debug Friendly**: Include technical details for troubleshooting

### **Security Requirements**
- **API Credentials**: Never log, display, or commit API keys
- **Environment Variables**: Use .env files for local development  
- **OAuth2 Flow**: Client credentials only (no user authentication)
- **Error Messages**: Sanitize error messages to prevent credential leaks

### **Documentation Standards**
- **Single Source Updates**: Update CURRENT_STATUS.md after testing
- **Cross-References**: Ensure internal links work
- **Commit Messages**: Clear documentation of changes
- **Status Consistency**: All tool counts must match across documents

---

*This guide consolidates information from multiple development documents and represents the current best practices for the project.*