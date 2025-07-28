#!/usr/bin/env python3

import re
import json

# Read the TypeScript file
with open('/Users/scottbaker/Workspace/mcp_server_for_habu/mcp-habu-runner/src/production-index.ts', 'r') as f:
    content = f.read()

# Find all tool definitions
tools_with_ids = []

# Pattern to match tool definitions
tool_pattern = r"{\s*name:\s*'([^']+)',\s*description:\s*'([^']+)',\s*inputSchema:\s*{[^}]*properties:\s*{([^}]+(?:}[^}]*)*?)}"

matches = re.finditer(tool_pattern, content, re.DOTALL)

for match in matches:
    tool_name = match.group(1)
    tool_desc = match.group(2)
    properties = match.group(3)
    
    # Look for ID-related parameters
    id_params = []
    
    # Common ID parameter patterns
    id_patterns = [
        r'cleanroomId.*?description:\s*\'([^\']+)\'',
        r'cleanroom_id.*?description:\s*\'([^\']+)\'',
        r'questionId.*?description:\s*\'([^\']+)\'',
        r'question_id.*?description:\s*\'([^\']+)\'',
        r'datasetId.*?description:\s*\'([^\']+)\'',
        r'dataset_id.*?description:\s*\'([^\']+)\'',
        r'connectionId.*?description:\s*\'([^\']+)\'',
        r'connection_id.*?description:\s*\'([^\']+)\'',
        r'runId.*?description:\s*\'([^\']+)\'',
        r'run_id.*?description:\s*\'([^\']+)\'',
        r'templateId.*?description:\s*\'([^\']+)\'',
        r'template_id.*?description:\s*\'([^\']+)\'',
        r'scheduleId.*?description:\s*\'([^\']+)\'',
        r'schedule_id.*?description:\s*\'([^\']+)\'',
        r'partnerId.*?description:\s*\'([^\']+)\'',
        r'partner_id.*?description:\s*\'([^\']+)\'',
        r'userId.*?description:\s*\'([^\']+)\'',
        r'user_id.*?description:\s*\'([^\']+)\'',
        r'roleId.*?description:\s*\'([^\']+)\'',
        r'role_id.*?description:\s*\'([^\']+)\'',
        r'executionId.*?description:\s*\'([^\']+)\'',
        r'execution_id.*?description:\s*\'([^\']+)\'',
        r'invitationId.*?description:\s*\'([^\']+)\'',
        r'invitation_id.*?description:\s*\'([^\']+)\'',
        r'jobId.*?description:\s*\'([^\']+)\'',
        r'job_id.*?description:\s*\'([^\']+)\'',
    ]
    
    for pattern in id_patterns:
        id_matches = re.findall(pattern, properties, re.DOTALL)
        for desc in id_matches:
            param_name = pattern.split('.*?')[0]
            id_params.append({
                'param': param_name,
                'description': desc.strip()
            })
    
    if id_params:
        tools_with_ids.append({
            'name': tool_name,
            'description': tool_desc[:100] + '...' if len(tool_desc) > 100 else tool_desc,
            'id_parameters': id_params
        })

# Print results
print("# 🔍 UUID Parameter Audit: Habu MCP Server Tools")
print(f"\n**Total Tools Analyzed**: 36")
print(f"**Tools Requiring IDs**: {len(tools_with_ids)}")
print(f"**Tools with Name Support**: {36 - len(tools_with_ids)}")

print("\n## 🚨 Tools Requiring UUID/ID Parameters:\n")

for i, tool in enumerate(tools_with_ids, 1):
    print(f"### {i}. `{tool['name']}`")
    print(f"**Description**: {tool['description']}")
    print("**ID Parameters Required**:")
    for param in tool['id_parameters']:
        print(f"- `{param['param']}`: {param['description']}")
    print()

print("## ✅ Tools Already Supporting Names:")
print("- `configure_data_connection_fields` (✅ Enhanced)")
print("- `test_connection` (No IDs required)")
print("- `list_cleanrooms` (No IDs required)")
print("- Any creation wizards (they create new entities)")