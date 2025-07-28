#!/usr/bin/env python3

import re

# Read the TypeScript file
with open('/Users/scottbaker/Workspace/mcp_server_for_habu/mcp-habu-runner/src/production-index.ts', 'r') as f:
    content = f.read()

# Find all tool definitions in the tools array
tools_section = re.search(r'tools:\s*\[(.*?)\]', content, re.DOTALL)
if not tools_section:
    print("Could not find tools section")
    exit(1)

tools_content = tools_section.group(1)

# Split by tool boundaries (each tool starts with {)
tool_matches = re.findall(r'{\s*name:\s*[\'"]([^\'"]+)[\'"],\s*description:\s*[\'"]([^\'"]*)[\'"].*?(?={\s*name:|$)', tools_content, re.DOTALL)

print("# 🔍 Comprehensive UUID Parameter Audit")
print(f"\n**Found {len(tool_matches)} tools in MCP server**\n")

# Categories for analysis
needs_enhancement = []
already_good = []
creation_tools = []

# Analyze each tool
for tool_name, description in tool_matches:
    # Get the full tool definition
    tool_pattern = f"name:\\s*['\"]{{tool_name}}['\"].*?(?=name:\\s*['\"]|}}\\s*\\])"
    tool_match = re.search(tool_pattern.replace('{tool_name}', re.escape(tool_name)), tools_content, re.DOTALL)
    
    if tool_match:
        full_tool = tool_match.group(0)
        
        # Check for ID parameters
        id_params = []
        
        # Look for various ID patterns
        id_patterns = [
            (r'cleanroomId', 'cleanroom ID'),
            (r'cleanroom_id', 'cleanroom ID'),
            (r'questionId', 'question ID'),
            (r'question_id', 'question ID'),
            (r'datasetId', 'dataset ID'),
            (r'dataset_id', 'dataset ID'),
            (r'connectionId', 'connection ID'),
            (r'connection_id', 'connection ID'),
            (r'runId', 'run ID'),
            (r'run_id', 'run ID'),
            (r'templateId', 'template ID'),
            (r'template_id', 'template ID'),
            (r'scheduleId', 'schedule ID'),
            (r'schedule_id', 'schedule ID'),
            (r'partnerId', 'partner ID'),
            (r'partner_id', 'partner ID'),
            (r'userId', 'user ID'),
            (r'user_id', 'user ID'),
            (r'roleId', 'role ID'),
            (r'role_id', 'role ID'),
            (r'executionId', 'execution ID'),
            (r'execution_id', 'execution ID'),
            (r'invitationId', 'invitation ID'),
            (r'invitation_id', 'invitation ID'),
            (r'jobId', 'job ID'),
            (r'job_id', 'job ID'),
        ]
        
        for pattern, desc in id_patterns:
            if re.search(pattern + r':', full_tool):
                id_params.append((pattern, desc))
        
        # Categorize the tool
        if 'create' in tool_name.lower() or 'start' in tool_name.lower() or 'wizard' in tool_name.lower():
            if id_params and 'cleanroom' not in tool_name.lower():
                creation_tools.append((tool_name, id_params, description[:80] + '...'))
            else:
                already_good.append(tool_name)
        elif id_params:
            # Check if it already supports names
            if 'name or id' in full_tool.lower() or 'accepts.*name' in full_tool.lower():
                already_good.append(tool_name)
            else:
                needs_enhancement.append((tool_name, id_params, description[:80] + '...'))
        else:
            already_good.append(tool_name)

print("## 🚨 HIGH PRIORITY: Tools Needing Name-Based Enhancement\n")
for i, (name, params, desc) in enumerate(needs_enhancement, 1):
    print(f"### {i}. `{name}`")
    print(f"**Issues**: ", end="")
    param_names = [p[1] for p in params]
    print(", ".join(param_names))
    print()

print(f"\n## ⚠️ MEDIUM PRIORITY: Creation Tools with ID Dependencies\n")
for i, (name, params, desc) in enumerate(creation_tools, 1):
    print(f"### {i}. `{name}`")
    print(f"**Dependencies**: ", end="")
    param_names = [p[1] for p in params]
    print(", ".join(param_names))
    print()

print(f"\n## ✅ GOOD: Tools Already Supporting Names or No IDs Required\n")
for name in already_good[:10]:  # Show first 10
    print(f"- `{name}`")
if len(already_good) > 10:
    print(f"- ... and {len(already_good) - 10} more")

print(f"\n## 📊 Summary Statistics")
print(f"- **Need Enhancement**: {len(needs_enhancement)} tools")
print(f"- **Creation Tools with Dependencies**: {len(creation_tools)} tools") 
print(f"- **Already Good**: {len(already_good)} tools")
print(f"- **Total Tools**: {len(needs_enhancement) + len(creation_tools) + len(already_good)}")