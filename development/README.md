# 🛠️ Development Resources

This directory contains all development resources, documentation, and supplementary projects for the MCP Server for Habu.

## 📋 **Quick Navigation**

### **📚 Documentation**
- **[Complete Documentation](docs/README.md)** - Full documentation navigation
- **[Current Status](docs/CURRENT_STATUS.md)** - Live project status
- **[Development Guide](docs/DEVELOPMENT_GUIDE.md)** - Developer workflows
- **[Tools Reference](docs/MCP_TOOLS_REFERENCE.md)** - User-friendly tool guide

### **🔧 Development Tools**
- **[Tools Directory](tools/)** - Utilities, scripts, distribution bundles
- **[Debugging Scripts](debugging-scripts/)** - API testing and debugging
- **[Examples](examples/)** - Usage examples and demonstrations
- **[Scripts](scripts/)** - Automation and build scripts

### **⚙️ Configuration**
- **[Config Directory](config/)** - STATUS.json, API specifications
- **package.json** - Node.js project metadata and scripts
- **pyproject.toml** - Python development tools configuration

### **🖥️ Related Projects**
- **[Dashboard Project](dashboard-project/)** - React dashboard for monitoring MCP server
- **[Archive](archive/)** - Historical documentation and completed phases

### **📊 Project Management**
- **[Cleanup Summary](ADVANCED_CLEANUP_SUMMARY.md)** - Repository organization changes

---

## 🗂️ **Directory Structure**

```
development/
├── README.md                                    # This navigation guide
├── package.json                                # Node.js project metadata
├── pyproject.toml                              # Python tools config
├── docs/                                       # Complete Documentation
│   ├── README.md                               # Documentation navigation
│   ├── MCP_TOOLS_REFERENCE.md                 # User tool guide
│   ├── CURRENT_STATUS.md                      # Live project status
│   ├── api/                                   # API documentation
│   └── testing/                               # Testing documentation
├── tools/                                     # Development Utilities
│   ├── create-distribution-bundle.sh          # Bundle creation
│   ├── mcp-habu-server-bundle.tar.gz         # Distribution archive
│   └── analysis scripts...
├── debugging-scripts/                         # Debug & Testing
│   ├── debug-*.js                            # API debugging
│   ├── test-*.js                             # Testing utilities
│   └── demo-*.js                             # Demonstrations
├── examples/                                  # Usage Examples
│   ├── check-crq-138029-runs.js              # Example API usage
│   └── test-oauth.js                         # Authentication example
├── config/                                    # Configuration
│   ├── STATUS.json                           # Project status data
│   └── liveramp-clean-room-api-specification.yml
├── scripts/                                   # Automation Scripts
│   ├── generate-status-json.js               # STATUS.json generation
│   └── validate-consistency.js               # Documentation validation
├── dashboard-project/                         # React Dashboard
│   ├── README.md                              # Dashboard project overview
│   ├── dashboard/                             # Full React application
│   └── deployment files...                   # Railway, Vercel configs
└── archive/                                   # Historical Resources
    └── completed phases, old documentation...
```

---

## 🚀 **Getting Started with Development**

### **For Documentation**
```bash
cd development/docs/
# Browse complete documentation starting with README.md
```

### **For Development Tools**
```bash
cd development/
npm install                    # Install Node.js dependencies
npm run sync-status           # Update STATUS.json
npm run validate-docs         # Check documentation consistency
```

### **For Debugging/Testing**
```bash
cd development/debugging-scripts/
node test-oauth.js            # Test authentication
node debug-cleanrooms.js      # Debug API calls
```

### **For Examples**
```bash
cd development/examples/
node check-crq-138029-runs.js # See example API usage
```

---

## 🎯 **Why This Organization?**

This structure follows **GitHub best practices** by keeping the main repository page ultra-clean while providing comprehensive development resources in an organized subdirectory.

### **Main Repository Benefits**
- **Clean first impression** for stakeholders and new users
- **Focus on core project** (MCP Server in mcp-habu-server-bundle/)
- **Professional appearance** suitable for sharing and collaboration

### **Development Directory Benefits**
- **Complete resources** easily accessible for developers
- **Logical organization** with clear navigation
- **Preserved functionality** - nothing lost, just better organized

---

*All development resources are actively maintained and reflect the current state of the project.*