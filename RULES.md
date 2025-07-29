# 📋 Project Rules & Guidelines: MCP Server for Habu

## 📖 Project Overview

**Project Name**: MCP Server for Habu  
**Type**: Model Context Protocol (MCP) Server for LiveRamp Clean Room API  
**Status**: Production Ready - Comprehensive Platform (99% API coverage)  
**Language**: TypeScript (Primary), Python (Development Tools)  
**License**: MIT  

**Mission**: Provide intelligent workflow-based access to the Habu Clean Room API through an MCP-compatible server, enabling AI agents to manage clean room operations, data connections, partner collaboration, and analytics execution.

---

## 🏗️ Project Architecture & Structure

### Core Directory Structure
```
mcp_server_for_habu/
├── mcp-habu-runner/          # Main MCP Server Implementation
│   ├── src/
│   │   ├── index.ts          # Production MCP server entry point
│   │   ├── production-index.ts # Enhanced production server
│   │   ├── auth.ts           # OAuth2 authentication logic
│   │   └── hybrid-index.ts   # Mixed mock/real API server
│   ├── dist/                 # Compiled TypeScript output
│   ├── package.json          # Node.js dependencies & scripts
│   └── .env                  # Environment configuration
├── pyproject.toml           # Python package configuration
├── *.md                     # Documentation files
├── *.js                     # Debug/test scripts
└── *.py                     # Analysis/audit utilities
```

### Core Components

#### 1. **MCP Server Core** (`mcp-habu-runner/src/`)
- **`index.ts`**: Main production server with 45 comprehensive tools
- **`auth.ts`**: OAuth2 client credentials flow implementation
- **`production-index.ts`**: Enhanced server with advanced features
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
- `mcp-habu-runner/src/index.ts` - Main production server
- `mcp-habu-runner/src/auth.ts` - Authentication implementation
- `mcp-habu-runner/package.json` - Node.js configuration
- `pyproject.toml` - Python package definition
- `.env` - Environment configuration (contains secrets)

#### **Documentation Critical**
- `README.md` - Project overview and setup
- `MCP_TOOL_TESTING_STATUS.md` - Testing status and findings
- `TESTING_PROGRESS.md` - Methodology and progress tracking
- `API_COVERAGE_ANALYSIS.md` - API implementation coverage

#### **Historical Critical**
- `MISSION_ACCOMPLISHED.md` - Project completion summary
- `IMPLEMENTATION_COMPLETE_SUMMARY.md` - Implementation achievements
- `NEW_WIZARDS_COMPLETION_SUMMARY.md` - Latest feature additions

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

When prompted to enter **Test Persona**, Memex transforms into a **Testing Agent for MCP Server functionality**. 

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
- **Tools Tested**: 8/45 (18% complete)
- **Test Environment**: Production cleanroom CR-045487
- **Authentication**: OAuth2 working with live credentials
- **Test Data**: Real partners, questions, and results

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