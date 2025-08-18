# 🔄 LOCAL vs GITHUB WORKFLOW GUIDE

*Quick reference for development workflow decisions*

---

## 🏠 **STAY LOCAL** 
*Work locally, don't push to GitHub yet*

### ✅ **WHEN TO STAY LOCAL:**
- Testing individual MCP tools
- Debugging API authentication issues  
- Iterating on code implementations
- Running validation and debug scripts
- Updating CURRENT_STATUS.md with progress
- Daily development work

### 🔧 **LOCAL WORKFLOW:**
```bash
# Test tools locally using MCP server
# Update CURRENT_STATUS.md with results
npm run sync-status          # Auto-generate STATUS.json
npm run validate-docs        # Check consistency
git add . && git commit      # Commit locally (don't push)
```

---

## 🚀 **PUSH TO GITHUB**
*Share milestone achievements*

### ✅ **WHEN TO PUSH TO GITHUB:**
- **Testing Milestones**: 5+ tools completed in batch
- **Critical Bug Fixes**: Authentication, security issues
- **New Feature Complete**: New MCP tools implemented  
- **Weekly Progress**: Consolidated testing progress
- **Documentation Updates**: Major workflow changes

### 🔧 **GITHUB WORKFLOW:**
```bash
# Pre-push security check
grep -r "CLIENT_SECRET\|CLIENT_ID" mcp-habu-runner/src/
grep -r "oTSkZnax86l8jfhzqillOBQk5MJ7zojh" .

# Final validation
npm run validate-docs
npm run sync-status

# Push to GitHub
git push origin main
```

---

## 📊 **CURRENT STATUS**

| Aspect | Status |
|--------|--------|
| **Active Phase** | Individual tool testing (local) |
| **Tools Tested** | 12/45 (27%) |
| **Next GitHub Push** | After 5 more tools OR weekly update |
| **Security** | ✅ Hardcoded credentials removed |
| **Repository** | ✅ Synchronized as of 2025-08-04 |

---

## 🎯 **DECISION FLOWCHART**

```
Working on testing individual tools? 
    ↓ YES → STAY LOCAL
    
Fixed critical security issue?
    ↓ YES → PUSH TO GITHUB
    
Completed 5+ tools in testing session?
    ↓ YES → PUSH TO GITHUB
    
End of week with progress to share?
    ↓ YES → PUSH TO GITHUB
    
Everything else?
    ↓ → STAY LOCAL
```

**Rule of Thumb**: Push meaningful milestones, keep daily work local.