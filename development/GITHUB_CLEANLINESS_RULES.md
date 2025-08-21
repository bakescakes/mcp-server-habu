# 🏆 GitHub Repository Cleanliness Rules

**Repository**: `bakescakes/mcp-server-habu`  
**Status**: Ultra-Clean (4 items maximum)  
**Importance**: CRITICAL - Maintains professional stakeholder presentation

---

## 🚨 **ABSOLUTE RULES - NEVER VIOLATE**

### **Rule #1: Root Directory Maximum**
- **NEVER exceed 4 items in repository root**
- Current items: `README.md`, `LICENSE`, `mcp-habu-server-bundle/`, `development/`
- **Any new file/directory MUST go in `development/` subdirectory**

### **Rule #2: No New Root Files**
- **NEVER create new files in repository root**
- **NEVER move files from `development/` back to root**
- **NEVER extract files from `mcp-habu-server-bundle/` to root**

### **Rule #3: Preserve Core Structure**
```
mcp-server-habu/                  # ONLY 4 ITEMS ALLOWED
├── README.md                     # ✅ Core project overview
├── LICENSE                       # ✅ Legal requirement  
├── mcp-habu-server-bundle/       # ✅ Main MCP server
└── development/                  # ✅ All other resources
```

---

## 📋 **SPECIFIC INSTRUCTIONS FOR AI ASSISTANTS**

### **When Adding New Files**
```
❌ WRONG: Create file in root directory
✅ CORRECT: Create file in development/ subdirectory

Examples:
❌ create new-feature.md (in root)
✅ create development/docs/new-feature.md
❌ create config.json (in root)  
✅ create development/config/config.json
❌ create debug-script.js (in root)
✅ create development/debugging-scripts/debug-script.js
```

### **When Adding New Directories**
```
❌ WRONG: mkdir new-directory (in root)
✅ CORRECT: mkdir development/new-directory

Examples:
❌ mkdir tests/ (in root)
✅ mkdir development/tests/
❌ mkdir scripts/ (in root)
✅ mkdir development/scripts/
```

### **When Moving Files**
```
❌ WRONG: mv development/file.md . (to root)
✅ CORRECT: mv file.md development/ (to development)
✅ CORRECT: mv file.md development/docs/ (to logical subdirectory)
```

---

## 🛠️ **DEVELOPMENT DIRECTORY ORGANIZATION**

All new content goes in organized subdirectories:

### **Documentation**: `development/docs/`
- User guides, API docs, project status, etc.

### **Development Tools**: `development/tools/`
- Scripts, utilities, build tools, distribution packages

### **Testing Resources**: `development/debugging-scripts/`
- Debug scripts, test files, validation tools

### **Examples**: `development/examples/`
- Usage examples, sample code, demonstrations

### **Configuration**: `development/config/`
- Config files, API specs, settings

### **Related Projects**: `development/dashboard-project/`
- Supplementary projects like the React dashboard

### **Historical**: `development/archive/`
- Completed phases, old documentation, historical records

---

## 🚨 **RED FLAGS - IMMEDIATE CORRECTION NEEDED**

### **If You See More Than 4 Items in Root:**
1. **STOP immediately**
2. Identify what was added
3. Move new items to appropriate `development/` subdirectory
4. Update any links in README.md to point to new location
5. Commit with clear message about maintaining cleanliness

### **Common Violations to Watch For:**
- Creating `docs/` directory in root (should be `development/docs/`)
- Creating `config/` directory in root (should be `development/config/`)
- Adding `package.json` to root (should be `development/package.json`)
- Extracting files from `mcp-habu-server-bundle/` to root
- Creating temporary files like `STATUS.json` in root

---

## ✅ **VERIFICATION CHECKLIST**

### **Before Any Commit:**
1. Run `ls -1 | wc -l` - must show **4** or fewer
2. Verify no new files/directories added to root
3. Check that all new content is in `development/` subdirectories
4. Update README.md links if files moved within `development/`

### **After Any Major Changes:**
1. Verify GitHub main page shows exactly 4 items
2. Test that all documentation links work
3. Confirm nothing broken by organization changes

---

## 📚 **CUSTOM INSTRUCTIONS FOR AI CONVERSATIONS**

### **Copy-Paste This Into Chat:**
```
REPOSITORY CLEANLINESS RULES:

1. NEVER add files/directories to repository root
2. Repository root MUST contain ONLY 4 items:
   - README.md
   - LICENSE  
   - mcp-habu-server-bundle/
   - development/

3. ALL new content goes in development/ subdirectories:
   - Docs: development/docs/
   - Tools: development/tools/
   - Tests: development/debugging-scripts/
   - Examples: development/examples/
   - Config: development/config/

4. If you need to create ANY file, ask yourself: 
   "Does this go in the repository root (answer: NO) or in development/?"

5. Before committing, verify: ls -1 | wc -l shows 4 or fewer items

VIOLATION = IMMEDIATE CORRECTION REQUIRED
```

---

## 🔧 **MAINTENANCE COMMANDS**

### **Check Cleanliness:**
```bash
cd /path/to/repository
ls -1 | wc -l    # Must show 4 or fewer
ls -1            # Must show only: README.md, LICENSE, mcp-habu-server-bundle, development
```

### **Emergency Cleanup:**
```bash
# If root gets messy, move items to development/
mv unwanted-file.md development/docs/
mv unwanted-config.json development/config/  
mv unwanted-script.js development/tools/
```

### **Restore Clean State:**
```bash
git reset --hard 9b97804  # Ultra-clean commit hash
git push --force origin main
```

---

## 🎯 **WHY THIS MATTERS**

### **Professional Impact:**
- **Stakeholder Confidence**: Clean repositories suggest quality projects
- **First Impressions**: Visitors immediately understand project purpose  
- **Industry Standards**: Matches practices of React, Vue.js, TypeScript
- **Scalability**: Structure supports growth without becoming cluttered

### **Technical Benefits:**
- **Easy Navigation**: Clear path to all resources
- **Logical Organization**: Related files grouped together
- **Maintenance**: Easier to find and update files
- **Collaboration**: New contributors can navigate easily

---

## 🏆 **SUCCESS METRICS**

- **✅ 4 items maximum** in repository root
- **✅ Professional appearance** on GitHub main page
- **✅ Easy navigation** for new users
- **✅ Logical organization** of all resources
- **✅ Zero broken links** after any reorganization

---

*These rules ensure the repository maintains professional excellence while preserving all functionality.*