# 📋 Project Rules & Guidelines: MCP Server for Habu

## 📖 Project Overview

**Project Name**: MCP Server for Habu  
**Type**: Model Context Protocol (MCP) Server for LiveRamp Clean Room API  
**Status**: Production Ready - Comprehensive Platform (99% API coverage)  
**Language**: TypeScript (Primary), Python (Development Tools)  
**License**: MIT  

**Mission**: Provide intelligent workflow-based access to the Habu Clean Room API through an MCP-compatible server, enabling AI agents to manage clean room operations, data connections, partner collaboration, and analytics execution.

---

## 🚨 **GITHUB REPOSITORY ORGANIZATION - CRITICAL RULES**

### **ABSOLUTE REQUIREMENTS - NEVER VIOLATE**

#### **Repository Root Maximum**
The `bakescakes/mcp-server-habu` repository root MUST contain ONLY these essential items:
- `README.md` - Project overview and quick start
- `LICENSE` - MIT license file
- `mcp-habu-server-bundle/` - Main MCP server directory
- `development/` - All development resources
- `dashboard/` - **DEPLOYMENT EXCEPTION** - Required for Railway/Vercel paths

#### **File Creation Rules**
- **NEVER create files in repository root**
- **NEVER create directories in repository root** 
- **ALL new content goes in `development/` subdirectories**

#### **Organization Standards**
```
mcp-server-habu/                  # ESSENTIAL ITEMS ONLY
├── README.md                     # ✅ Core project overview
├── LICENSE                       # ✅ Legal requirement
├── mcp-habu-server-bundle/       # ✅ Main MCP server
├── dashboard/                    # ✅ DEPLOYMENT EXCEPTION (Railway/Vercel)
│   ├── frontend/                 # React frontend for Vercel
│   └── backend/                  # Node.js backend for Railway
└── development/                  # ✅ Everything else goes here
    ├── docs/                     # Documentation
    ├── tools/                    # Development utilities  
    ├── debugging-scripts/        # Testing and debugging
    ├── examples/                 # Usage examples
    └── config/                   # Configuration files
```

#### **Before Every Commit - Verification Required**
```bash
ls -1 | wc -l    # MUST show 5 or fewer items (includes deployment exception)
```

#### **Emergency Restoration**
```bash
git reset --hard 5ca95ef  # Ultra-clean commit
git push --force origin main
```

**Rationale**: This maintains professional GitHub presentation matching industry leaders (React, Vue.js, TypeScript) and ensures stakeholder-ready appearance.

### **DEVELOPMENT CLUTTER PREVENTION - CRITICAL**

#### **DO NOT COMMIT - Temporary Development Files**
- **Debug Scripts**: `debug-*.js`, `test-*.js`, `check-*.js`
- **Analysis Tools**: `audit_*.py`, `analyze-*.js`, one-off exploration scripts
- **Temporary Files**: `temp-*.js`, `scratch-*.py`, exploration code
- **Log Files**: `*.log`, `streamlit.log`, debug outputs
- **Build Artifacts**: `*.tar.gz`, distribution bundles
- **Demo/Test Files**: `demo-*.js`, temporary testing utilities

#### **Keep Local Only - Development Workflow**
```bash
# Create temporary files in ignored patterns
debug-feature-test.js       # ✅ Will be ignored
temp-api-exploration.py     # ✅ Will be ignored
check-endpoints.js          # ✅ Will be ignored
```

#### **What TO Commit - Permanent Value**
- **Core MCP Server Code**: Production server files
- **Documentation**: User guides, API references, project status
- **Configuration**: Deployment configs, package.json files
- **Examples**: Reusable code examples (not debugging scripts)

#### **Before Every Commit - Clutter Check**
```bash
git status                  # Review what's being added
# Ask: "Is this permanent value or temporary exploration?"
# If temporary exploration → Don't commit or add to .gitignore
```

**Rationale**: Prevents repository clutter, maintains professional presentation, and keeps focus on permanent project value.

---

## 🏗️ Project Architecture & Structure

### Core Directory Structure
```
mcp-server-habu/               # ULTRA-CLEAN: Only 4 items in root
├── README.md                  # Project overview and quick start
├── LICENSE                    # MIT license
├── mcp-habu-server-bundle/    # Main MCP Server Implementation
│   ├── src/
│   │   ├── index.ts           # Main production server (OAuth2)
│   │   ├── auth.ts            # OAuth2 authentication logic
│   │   └── hybrid-index.ts    # Development server with mocks
│   ├── dist/                  # Compiled TypeScript output
│   ├── package.json           # Node.js dependencies & scripts
│   └── .env                   # Environment configuration
└── development/               # All development resources
    ├── docs/                  # Complete documentation
    ├── tools/                 # Development utilities
    ├── debugging-scripts/     # Debug/test scripts
    ├── examples/              # Usage examples
    ├── config/                # Configuration files
    ├── dashboard-project/     # React dashboard
    └── archive/               # Historical documentation
```

### Core Components

#### 1. **MCP Server Core** (`mcp-habu-server-bundle/src/`)
- **`index.ts`**: Main production server with 45 comprehensive tools
- **`auth.ts`**: OAuth2 client credentials flow implementation
- **`hybrid-index.ts`**: Development server with mock fallbacks

#### 2. **Authentication System**
- **OAuth2 Flow**: Client credentials grant type
- **Token Management**: Automatic token refresh and caching
- **Error Handling**: Comprehensive authentication error recovery
- **Security**: Environment-based credential management

#### 3. **Tool Categories** (45 Total Tools)
- **Connection Testing**: `test_connection`
- **Clean Room Management**: Create, configure, monitor, lifecycle
- **Data Connections**: Multi-cloud wizards (AWS, GCP, Azure, Snowflake, etc.)
- **Partner Collaboration**: Invitations, permissions, onboarding
- **Question Management**: Deploy, execute, schedule, monitor
- **Results & Export**: Access, format, export workflows
- **Advanced Features**: Templates, user management, audit trails

---

## 🗂️ Core Files & Utility Functions

### Essential Files (Never Delete/Modify Without Review)

#### **Production Critical**
- `mcp-habu-server-bundle/src/index.ts` - Main production server
- `mcp-habu-server-bundle/src/auth.ts` - Authentication implementation
- `mcp-habu-server-bundle/package.json` - Node.js configuration
- `development/pyproject.toml` - Python package definition
- `mcp-habu-server-bundle/.env` - Environment configuration (contains secrets)

#### **Documentation Critical**
- `README.md` - Project overview and setup
- `development/docs/MCP_TOOL_TESTING_STATUS.md` - Testing status and findings
- `development/docs/TESTING_PROGRESS.md` - Methodology and progress tracking
- `development/docs/API_COVERAGE_ANALYSIS.md` - API implementation coverage

#### **Historical Critical**
- `development/archive/MISSION_ACCOMPLISHED.md` - Project completion summary
- `development/archive/IMPLEMENTATION_COMPLETE_SUMMARY.md` - Implementation achievements
- `development/archive/NEW_WIZARDS_COMPLETION_SUMMARY.md` - Latest feature additions

### Utility Functions & Patterns

#### **Authentication Pattern**
```typescript
// OAuth2 client credentials flow
const tokenResponse = await axios.post('/oauth/token', {
  grant_type: 'client_credentials'
}, {
  auth: {
    username: CLIENT_ID,
    password: CLIENT_SECRET
  }
});
```

#### **API Resolution Pattern**
```typescript
// Universal ID resolution (UUID, Display ID, or name)
async function resolveCleanroomId(identifier: string): Promise<string> {
  // Try as UUID first, then display ID, then name
}
```

#### **Error Handling Pattern**
```typescript
// Comprehensive error context
catch (error) {
  return {
    success: false,
    error: error.message,
    debugInfo: {
      endpoint: '/api/endpoint',
      method: 'POST',
      statusCode: error.response?.status
    }
  };
}
```

---

## 🎨 Code Style Guidelines

### TypeScript Standards
- **Target**: ES2020+ with Node.js compatibility
- **Formatting**: Prettier with 2-space indentation
- **Naming**: camelCase for variables/functions, UPPER_CASE for constants
- **Imports**: Use ES6 import syntax
- **Async**: Prefer async/await over Promises

### Code Organization
```typescript
// Standard file structure
import statements
interface definitions
constants & configuration
helper functions
main implementation
export statements
```

### Documentation Standards
- **Functions**: JSDoc comments for all public functions
- **Interfaces**: Document all properties with descriptions
- **Complex Logic**: Inline comments explaining business logic
- **API Calls**: Document expected request/response formats

### Error Handling Requirements
- **Never Silent Fail**: Always return error information
- **Context Rich**: Include endpoint, method, parameters in errors
- **User Friendly**: Provide actionable error messages
- **Debug Friendly**: Include technical details for troubleshooting

---

## 🧪 Testing Framework & Methodology

### Testing Strategy: **Real API Validation**
- **Production API**: All tests run against live Habu API
- **Real Data**: Use actual clean rooms, partners, and data connections
- **End-to-End**: Validate complete workflows, not just API responses
- **Business Impact**: Verify actual business logic changes (e.g., partner counts)

### Test Persona Mode 🎭

#### **Magic Syntax Commands** ✨

**Quick Mode Switching:**
- **`@test`** - Enter Test Persona mode (stays active for all successive interactions until disabled)
- **`@normal`** - Exit Test Persona mode and resume normal Memex behavior

**Usage Examples:**
```
@test
(Now in Test Persona mode - will stay until @normal is used)

@normal  
(Back to normal Memex developer mode)
```

When **`@test`** is used, Memex transforms into a **Testing Agent for MCP Server functionality**. 

#### **Test Persona Definition**
**Role**: Generic AI Assistant testing MCP tools (NOT Memex the developer)  
**Scope**: Tool validation through realistic user scenarios  
**Restrictions**: 
- NEVER write code, build applications, or engage in development tasks
- Focus solely on validating tool functionality
- Act as any general-purpose AI would interact with these tools
- Use only user-provided prompts (never synthetic/AI-generated content)

#### **Test Persona Workflow** (9-Step Process)
**Important**: Do not proceed to next tool until user confirms satisfaction with current tool performance.

For each tool being tested:

1. **🔍 Tool Introduction**: Announce which tool we are testing
2. **📖 Tool Explanation**: Explain how the tool works:
   - Which API calls it bundles
   - What user input it needs  
   - Built-in logic and workflows
   - Provide example prompt for testing
3. **📝 User Prompt**: Wait for user to provide the test prompt
4. **⚡ Tool Execution**: Execute MCP tool with production connection and real data
5. **🤝 Multi-Step Handling**: For multi-step tools, always ask user for clarification/input (never generate fake data)
6. **✅ User Validation**: User checks UI to confirm output worked as expected
7. **🐛 Issue Documentation**: If issues found, document user feedback
8. **🔧 Debug Mode Switch**: If changes needed, exit Test Persona → Normal Memex mode for debugging/fixing → Return to Test Persona after fixes implemented
9. **➡️ Next Tool**: Move to next tool only after user confirmation of success

#### **Test Persona Behavioral Guidelines**
- **Communication Style**: Generic AI assistant, not technical developer
- **Problem Approach**: User-focused testing scenarios, not technical debugging
- **Data Handling**: Only use real user inputs, never fabricate test data
- **Error Reporting**: Focus on user experience and functionality gaps
- **Scope Boundaries**: Testing only - no development, coding, or architectural decisions

#### **Mode Persistence & Switching**
- **`@test` Mode**: Remains active across ALL interactions until explicitly disabled
- **`@normal` Mode**: Immediately returns to full Memex developer capabilities
- **Context Preservation**: Testing progress and current tool status maintained across mode switches
- **Emergency Exit**: Can exit Test Persona at any time if development/debugging needed
- **Re-entry**: Can return to Test Persona mode and resume where testing left off

#### **Behavioral Differences by Mode**

| Aspect | `@test` Mode (Test Persona) | `@normal` Mode (Memex) |
|--------|----------------------------|------------------------|
| **Identity** | Generic AI Testing Agent | Memex Development Assistant |
| **Capabilities** | Tool testing only | Full development capabilities |
| **Code Interaction** | Never writes/modifies code | Writes, debugs, and fixes code |
| **Data Generation** | Only uses user-provided inputs | Can generate test data/scenarios |
| **Problem Solving** | Reports issues for developer | Actively debugs and fixes issues |
| **Communication** | User-focused, non-technical | Technical, developer-oriented |
| **Scope** | MCP tool validation only | Full project development |

### Standard Testing Workflow (Non-Persona Mode)
1. **Tool Explanation**: Document what the tool does
2. **User Test Prompt**: Get specific test scenario from user
3. **Production Execution**: Run tool with real API
4. **Result Validation**: Verify both API response and business impact
5. **Documentation**: Record findings, issues, and learnings
6. **Git Commit**: Commit test results and any fixes

### Test Documentation Structure
- **Status**: ✅ Verified, 🟡 Partial, ❌ Broken
- **Test Cases**: Happy path, edge cases, error scenarios
- **Issues Found**: API bugs, documentation gaps, logic errors
- **Business Impact**: Real-world effects of tool execution
- **Learnings**: Insights about API behavior and requirements

### Current Testing Status
- **Tools Tested**: 11/45 (24% complete)
- **Test Environment**: Production cleanroom CR-045487
- **Authentication**: OAuth2 working with live credentials
- **Test Data**: Real partners, questions, and results

---

## ⚡ Magic Syntax Commands

### **Command Reference**

#### **Mode Switching Commands**
- **`@test`** - Activate Test Persona mode
  - **Persistence**: Remains active until `@normal` is used
  - **Behavior**: Transforms Memex into generic AI testing agent
  - **Scope**: MCP tool validation only, no development tasks
  - **Response**: Acknowledges mode switch and explains current testing status

- **`@normal`** - Activate Normal Memex mode  
  - **Persistence**: Default mode, remains active until `@test` is used
  - **Behavior**: Full Memex development assistant capabilities
  - **Scope**: Complete project development, debugging, coding
  - **Response**: Acknowledges mode switch and readiness for development tasks

#### **Command Syntax Rules**
- **Prefix**: Commands must start with `@` symbol
- **Case Insensitive**: `@test`, `@TEST`, `@Test` all work
- **Position**: Can be used anywhere in message (beginning preferred)
- **Standalone**: Commands can be sent as single-word messages
- **Override**: New mode command immediately overrides current mode

#### **Usage Examples**
```
User: @test execute_question_run
Memex: [Enters Test Persona] I'm now in Test Persona mode. Let's test the execute_question_run tool...

User: There's a bug in the authentication
Memex: [Still in Test Persona] I'll document this issue. For debugging, please use @normal to switch modes.

User: @normal  
Memex: [Exits Test Persona] Back to normal Memex mode. I can now debug the authentication issue...
```

---

## 🛠️ Common Issues & Troubleshooting

### **🚨 MCP Server Issues - RESTART FIRST!**

**Rule #1**: When MCP Server tools are not functioning as expected, **ALWAYS restart the MCP server first** before debugging code.

#### **Quick MCP Server Restart Process:**
```
1. Disable server: mcp_toggle_server("habu-cleanroom", false)
2. Enable server: mcp_toggle_server("habu-cleanroom", true)  
3. Test tool functionality
```

#### **When to Restart MCP Server:**
- ✅ **After code changes** - Server caches the compiled code
- ✅ **Tool returning old responses** - Cached behavior from previous version
- ✅ **404 errors on working endpoints** - Server may be using outdated code
- ✅ **Environment variable changes** - Server needs to reload configuration
- ✅ **"Tool not working" reports** - Rule out caching issues first

#### **MCP Server Troubleshooting Checklist:**

**Step 1: Server Status Check**
```
mcp_list_servers() - Verify server is enabled and initialized
```

**Step 2: Restart Server**
```
mcp_toggle_server("habu-cleanroom", false)
mcp_toggle_server("habu-cleanroom", true)
```

**Step 3: Test Basic Connectivity**
```
test_connection() - Verify OAuth2 and API access
```

**Step 4: Test Simple Tool**
```
list_cleanrooms() - Verify basic API calls work
```

**Step 5: If Still Failing - Check Code**
- Verify `npm run build` completed successfully
- Check environment variables in MCP configuration
- Review error messages for API vs. code issues

### **🔧 Common Development Issues**

#### **Authentication Problems**
- **Symptoms**: 401 errors, "authentication failed"
- **Solutions**:
  1. Verify `HABU_CLIENT_ID` and `HABU_CLIENT_SECRET` in MCP config
  2. Check `.env` file has correct OAuth2 credentials
  3. Test with `test_connection()` tool

#### **API Endpoint Issues**  
- **Symptoms**: 404 errors, endpoint not found
- **Solutions**:
  1. **Restart MCP server first!**
  2. Verify endpoint in manual testing scripts
  3. Check ID resolution (Display ID vs UUID vs name)

#### **Parameter Issues**
- **Symptoms**: 400 errors, validation failures
- **Solutions**:
  1. Check partition parameters are included for questions
  2. Verify runtime parameter names match question requirements
  3. Ensure proper parameter types (strings for all values)

#### **Question Execution Issues**
- **Symptoms**: Questions not triggering, timeout errors
- **Solutions**:
  1. Include required partition parameters (date ranges)
  2. Set `monitorExecution: false` (questions take 15-30+ minutes)
  3. Use proper date formats: "YYYY-MM-DD"

### **📋 Testing Issues**

#### **Test Persona vs Normal Mode Confusion**
- **Problem**: Wrong mode for the task at hand
- **Solution**: 
  - Use `@test` for tool validation and user scenario testing
  - Use `@normal` for development, debugging, and code changes

#### **Mock vs Real API Issues**
- **Problem**: Tool works in testing but not in production
- **Solution**: Verify `USE_REAL_API=true` in MCP server environment

### **🔍 Debugging Best Practices**

#### **When Code Changes Don't Work:**
1. **RESTART MCP SERVER FIRST** (cannot be emphasized enough!)
2. Verify `npm run build` completed without errors
3. Check git commits to ensure changes were saved
4. Test manually with debug scripts before assuming MCP issue

#### **When APIs Fail:**
1. Test with manual scripts first (e.g., `node test-oauth.js`)
2. Check authentication with `test_connection()` tool
3. Verify endpoints and parameters with Habu API documentation
4. Check rate limiting and API quotas

#### **When Tools Return Old Behavior:**
1. **Restart MCP server immediately**
2. Don't waste time debugging "phantom" issues
3. Server caching is the most common cause of this

### **⚠️ Critical Reminders**

- **Never debug MCP tools without restarting the server first**
- **Manual testing success + MCP failure = Server restart needed** 
- **Code changes require server restart to take effect**
- **Environment variable changes require server restart**
- **When in doubt, restart the server**

---

## 🔄 Development Workflows

### Git Workflow
- **Main Branch**: `main` (production-ready code only)
- **Feature Branches**: For new tool development
- **Commit Standards**: Descriptive messages with context
- **Special Suffix**: `\n\n🤖 Generated with [Memex](https://memex.tech)\nCo-Authored-By: Memex <noreply@memex.tech>`

### Development Cycle
1. **Planning**: Create/update plan documentation
2. **Implementation**: Code new features with comprehensive error handling
3. **Testing**: Real API validation with production data
4. **Documentation**: Update all relevant documentation files
5. **Commit**: Git commit with detailed commit message
6. **User Confirmation**: Confirm milestone completion before proceeding

### Code Review Standards
- **Security Review**: Check for credential leaks or security issues
- **Error Handling**: Verify comprehensive error handling and user guidance
- **Documentation**: Ensure all changes are documented
- **Testing**: Verify testing has been completed
- **Breaking Changes**: Flag any breaking changes in commit messages

---

## ⚙️ Environment Setup Instructions

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

### MCP Server Configuration
Add to MCP client configuration:
```json
{
  "mcpServers": {
    "habu-cleanroom": {
      "command": "node",
      "args": ["/path/to/mcp-habu-runner/dist/index.js"],
      "env": {
        "CLIENT_ID": "your_client_id",
        "CLIENT_SECRET": "your_client_secret"
      }
    }
  }
}
```

---

## 🚀 Deployment Processes

### Production Deployment
1. **Build Verification**: Ensure `npm run build` succeeds
2. **Environment Check**: Verify all required environment variables
3. **Authentication Test**: Run `test_connection` tool to verify API access
4. **MCP Integration**: Test with MCP client (Claude, Memex, etc.)
5. **Tool Verification**: Run subset of critical tools to verify functionality

### MCP Server Distribution
- **Build Output**: `mcp-habu-runner/dist/index.js`
- **Dependencies**: All dependencies included in node_modules
- **Configuration**: Environment variables required for authentication
- **Platform**: Cross-platform Node.js application

### Version Management
- **Semantic Versioning**: Major.Minor.Patch format
- **Release Notes**: Document new features and breaking changes
- **Compatibility**: Maintain backward compatibility for tool interfaces
- **Migration Guides**: Provide guides for breaking changes

---

## 🔒 Unique Project Requirements & Constraints

### Security Requirements
- **API Credentials**: Never log, display, or commit API keys
- **Environment Variables**: Use .env files for local development
- **OAuth2 Flow**: Client credentials only (no user authentication)
- **Error Messages**: Sanitize error messages to prevent credential leaks

### API Constraints
- **Rate Limiting**: Habu API has rate limits (specific limits unknown)
- **Authentication**: OAuth2 client credentials with specific header format
- **ID Resolution**: Support UUID, Display ID, and name-based lookups
- **Mock Fallbacks**: Support mock data when API is unavailable

### MCP Protocol Requirements
- **Tool Schema**: All tools must have proper JSON schema definitions
- **Error Handling**: Errors must be MCP-compatible error objects
- **Async Operations**: All API calls must be properly awaited
- **Response Format**: Consistent response structure across all tools

### Business Logic Constraints
- **Wizard Tools**: Step-by-step workflows with state management
- **Self-Invitations**: Support admin self-invites for demo scenarios
- **Email Dependencies**: Partner invitations require existing Habu accounts
- **Real-Time Monitoring**: Question execution monitoring with status updates

### Testing Constraints
- **Production API Only**: No comprehensive staging environment
- **Real Data Impact**: Tests affect production clean rooms
- **User Account Dependencies**: Some features require multiple user accounts
- **Business Hour Testing**: Some API operations may be business-hour dependent

---

## 📈 Success Metrics & KPIs

### Technical Metrics
- **API Coverage**: 99% of business-critical functionality (45/45 tools)
- **Data Source Coverage**: 50% (14/28 supported platforms)
- **Tool Success Rate**: >95% successful execution in production
- **Authentication Reliability**: 100% OAuth2 authentication success

### Business Metrics
- **Workflow Automation**: Complete clean room lifecycle automation
- **Partner Onboarding**: Streamlined partner invitation and setup
- **Question Execution**: Automated analytics execution and monitoring
- **Multi-Cloud Support**: Enterprise data connection management

### User Experience Metrics
- **Tool Discoverability**: Clear documentation and examples
- **Error Handling**: Actionable error messages and guidance
- **Wizard Completion**: High completion rates for multi-step workflows
- **Real-Time Feedback**: Progress indicators and status updates

---

## 🔧 Maintenance & Support

### Regular Maintenance Tasks
- **Dependency Updates**: Monthly npm/pip dependency updates
- **Security Patches**: Immediate application of security patches
- **API Compatibility**: Monitor Habu API changes and deprecations
- **Documentation Updates**: Keep documentation synchronized with code

### Monitoring & Alerting
- **Authentication Failures**: Monitor OAuth2 token refresh failures
- **API Errors**: Track API error rates and patterns
- **Tool Failures**: Monitor individual tool success rates
- **Performance Metrics**: Track API response times and timeouts

### Support Procedures
- **Issue Triage**: Categorize issues by severity and component
- **Debug Information**: Comprehensive logging for troubleshooting
- **User Guidance**: Clear documentation and error messages
- **Escalation Path**: Direct line to Habu API support when needed

---

## 📋 **DOCUMENTATION UPDATE GUIDELINES** ⭐ **COMPLETELY UPDATED**

### **🎯 NEW MASTER RULE: Automated Single Source of Truth**
**BREAKTHROUGH**: Documentation overhaul completed August 4, 2025. **Manual sync errors are now IMPOSSIBLE** due to automated generation system.

### **🚀 NEW AUTOMATED WORKFLOW** ✨
**MAJOR IMPROVEMENT**: STATUS.json is now automatically generated from CURRENT_STATUS.md!

**THE NEW 1-STEP WORKFLOW**:
```bash
1. Update CURRENT_STATUS.md ONLY (single source of truth)
2. Run: npm run sync-status 
3. Commit: npm run commit-status -m "🧪 TEST COMPLETE: [tool] - [result]"
# STATUS.json automatically synchronized - zero manual work!
```

---

### **📊 NEW DOCUMENTATION STRUCTURE** (Post-Overhaul)

#### **🎯 SINGLE SOURCE OF TRUTH**
**CURRENT_STATUS.md** 🥇 *[Master Document - Update This Only]*
- **Purpose**: Authoritative source for all dynamic project information
- **Update When**: Tool testing, milestones, status changes, issues
- **Auto-Generates**: STATUS.json via scripts/generate-status-json.js
- **Structure**: Structured markdown tables for API parsing
- **Authority**: Replaces all conflicting status files

#### **📱 AUTOMATED GENERATION**
**STATUS.json** 🤖 *[Auto-Generated - Never Edit Manually]*
- **Source**: Automatically generated from CURRENT_STATUS.md
- **Purpose**: Fast API consumption for React website
- **Update Method**: npm run sync-status (automated)
- **Manual Editing**: ❌ FORBIDDEN - will be overwritten
- **Consistency**: 100% guaranteed to match CURRENT_STATUS.md

#### **📚 STABLE REFERENCE DOCUMENTS** (Rarely Change)
- **README.md** 📖 - Project introduction, setup, navigation
- **DEVELOPMENT_GUIDE.md** 🔧 - Developer workflows, automation, troubleshooting  
- **MCP_TOOLS_REFERENCE.md** 📚 - User-facing tool documentation
- **MCP_TOOLS_REFERENCE_DETAILED.md** 🔬 - Technical implementation details

---

### **🔄 Event-Driven Update Matrix**

#### **🧪 TESTING EVENT: New Tool Validated** ✨ **NEW AUTOMATED WORKFLOW**
**Trigger**: Tool successfully tested and validated
**Files to Update** (in order):
1. **CURRENT_STATUS.md** ✅ *[ONLY file to manually update]*
   - Add tool to "✅ CONFIRMED TESTED TOOLS" table
   - Update testing progress counters (12→13 tools, 27%→29% progress)
   - Update "Next Tool" section
   - Add any issues to "Known Issues" section

2. **Automated Generation** 🤖 *[Zero manual work]*
   - Run: `npm run sync-status`
   - STATUS.json automatically updated from CURRENT_STATUS.md
   - Validation automatically performed
   - Consistency guaranteed

3. **Optional Updates** (if needed):
   - **MCP_TOOLS_REFERENCE_DETAILED.md** - IF technical details changed
   - **DEVELOPMENT_GUIDE.md** - IF workflow changes discovered

4. **Git Commit** 📝 *[Automated]*
   - Use: `npm run commit-status -m "🧪 TEST COMPLETE: [tool_name] - [result]"`
   - Both CURRENT_STATUS.md and STATUS.json committed together

#### **🔧 CODE EVENT: New Tool Added**
**Trigger**: New MCP tool implemented
**Files to Update**:
1. **MCP_TOOLS_REFERENCE.md** - Add tool documentation
2. **MCP_TOOLS_REFERENCE_DETAILED.md** - Add technical implementation details
3. **CURRENT_STATUS.md** - Update total tool count if needed
4. **Auto-sync**: `npm run sync-status` (STATUS.json updated automatically)

#### **📚 DOCUMENTATION EVENT: Major Update**
**Trigger**: Significant documentation changes or cleanup
**Files to Update**:
1. **README.md** - Update documentation section references
2. **CURRENT_STATUS.md** - Update project status information
3. **Auto-sync**: `npm run sync-status` (STATUS.json updated automatically)

---

### **📱 React Website Priority Documents**

#### **Primary Data Sources** (React should consume):
1. **STATUS.json** 🥇 *[Real-time project status]*
   - Current tool counts and testing progress
   - Next priorities and recent achievements
   - Machine-readable format optimized for UI consumption

2. **MCP_TOOLS_REFERENCE.md** 🥈 *[User-friendly tool guide]*
   - Human-readable tool descriptions and usage examples
   - Organized by categories for UI navigation
   - Complete tool functionality overview

#### **Enhanced Data Sources** (React should consume):
3. **MCP_TOOLS_REFERENCE_DETAILED.md** 🥉 *[Technical implementation details]*
   - Complete API analysis with 100+ endpoints documented
   - Built-in intelligence and automation workflows
   - Cross-tool dependency analysis and technical insights

4. **MCP_TOOL_TESTING_STATUS.md** 🎖️ *[Testing progress and validation]*
   - Tool-by-tool testing outcomes and detailed issues
   - Key learnings and insights from testing
   - Known limitations and workarounds

5. **BATCH_EXECUTION_TESTING_LOG.md** 🔬 *[Testing evidence and validation]*
   - Major testing breakthroughs and technical discoveries
   - Real production testing evidence with run IDs and timestamps
   - Comprehensive validation methodology and insights

6. **TESTING_PROGRESS.md** 📈 *[Testing methodology and work queue]*
   - Prioritized testing queue across 8 phases (34 remaining tools)
   - Phase completion percentages and progress tracking
   - Testing methodology and evidence sources

#### **Secondary References** (React can link to these):
3. **MCP_TOOLS_REFERENCE_DETAILED.md** 🥉 *[Technical implementation details]*
   - Complete API analysis and implementation details
   - For developers and technical integrators
   - Comprehensive tool capability documentation

4. **README.md** 🏅 *[Project overview and setup]*
   - Project introduction and key achievements
   - Installation and configuration instructions
   - Links to all other documentation

5. **MCP_TOOL_TESTING_STATUS.md** 🎖️ *[Testing progress and validation]*
   - Current testing status and methodology
   - Detailed test results and issue tracking
   - Next testing priorities and plans

6. **BATCH_EXECUTION_TESTING_LOG.md** 🔬 *[Testing evidence and validation]*
   - Comprehensive testing evidence with real production data
   - Detailed validation of execute_question_run with 10 questions
   - Actual run IDs, timestamps, and API responses
   - Technical troubleshooting and methodology insights

---

### **⚠️ Consistency Checkpoints**

#### **Before Any Documentation Commit**:
1. ✅ **Cross-Reference Check**: Verify all tool counts match across files
2. ✅ **Next Tool Alignment**: Ensure same "next tool" across all testing files  
3. ✅ **Percentage Validation**: Confirm testing percentages are mathematically correct
4. ✅ **Date Consistency**: Update all timestamp fields to same date

#### **Weekly Maintenance** (if actively testing):
1. 🔍 **Audit Tool Counts**: Verify all files show same totals
2. 🔍 **Check Cross-References**: Ensure internal links work
3. 🔍 **Validate Testing Queue**: Confirm priority order makes sense
4. 🔍 **Update Achievement Lists**: Keep recent achievements current

#### **Monthly Maintenance**:
1. 📊 **STATUS.json Cleanup**: Remove outdated achievement entries
2. 📚 **Documentation Links**: Verify all external references work
3. 🧹 **File Organization**: Archive completed planning documents
4. 📈 **Progress Analysis**: Update success metrics and KPIs

---

### **🚨 ERROR PREVENTION Rules** ✨ **AUTOMATED PREVENTION**

#### **SYNC ERRORS NOW IMPOSSIBLE** ✅
- ✅ **New**: STATUS.json automatically generated from CURRENT_STATUS.md
- ✅ **New**: Consistency validation built into npm scripts
- ✅ **New**: Single source of truth eliminates conflicts
- ✅ **Result**: Manual sync errors are architecturally impossible

#### **AUTOMATED CONSISTENCY VALIDATION**
- ✅ **Tool**: `npm run validate-docs` checks data consistency
- ✅ **Tool**: `npm run sync-status` includes automatic validation
- ✅ **Tool**: Generation script validates all extracted data
- ✅ **Protection**: Malformed data triggers clear error messages

#### **NEW SIMPLIFIED RULES**
- ✅ **Update CURRENT_STATUS.md only** (single source of truth)
- ✅ **Run automated sync** with `npm run sync-status`
- ✅ **Validation runs automatically** on every generation
- ✅ **Commit both files together** with `npm run commit-status`

#### **BACKWARD COMPATIBILITY PROTECTION**
- ⚠️ **Legacy files archived** in `/archive/` directory
- ⚠️ **Old status files deprecated** with clear warning headers
- ⚠️ **Migration completed** - no conflicting information sources remain

---

### **🔧 Quick Update Commands**

#### **Testing Progress Update Template**:
```bash
# 1. Update core counts in CURRENT_STATUS.md
# 2. Run: npm run sync-status
# 3. Commit: npm run commit-status -m "🧪 TEST COMPLETE: [tool_name] - [status]"
```

#### **Documentation Sync Check**:
```bash
# Validate documentation consistency:
npm run validate-docs
# Should pass all checks - reports any inconsistencies
```

#### **New Automation Commands** ✨:
```bash
npm run generate-status    # Generate STATUS.json from CURRENT_STATUS.md
npm run sync-status        # Generate + confirmation message  
npm run validate-docs      # Check consistency between files
npm run commit-status      # Generate + stage files for commit
```

---

## 📚 Additional Resources

### Documentation References
- **MCP Protocol**: https://modelcontextprotocol.io/
- **Habu API**: Clean_Room-Complete-Documentation-June-2025.pdf
- **Testing Methodology**: TESTING_PROGRESS.md
- **API Coverage**: API_COVERAGE_ANALYSIS.md

### Development Tools
- **Debug Scripts**: Various test-*.js files for API testing
- **Analysis Tools**: Python scripts for auditing and analysis
- **Mock Data**: Hybrid server with mock fallbacks for development

### Communication Channels
- **Project Issues**: Use GitHub Issues for bug reports
- **Feature Requests**: Document in planning files before implementation
- **API Questions**: Direct communication with Habu API team when needed

---

*Last Updated: January 2025*  
*Version: Production Ready v1.0*  
*Status: 99% API Coverage Complete*