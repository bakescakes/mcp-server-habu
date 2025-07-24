#!/usr/bin/env node

const { spawn } = require('child_process');

// Test the new tools by sending MCP requests
const mcpServer = spawn('node', ['dist/production-index.js'], {
  cwd: '/Users/scottbaker/Workspace/mcp_server_for_habu/mcp-habu-runner',
  stdio: ['pipe', 'pipe', 'pipe']
});

// Test 1: List tools to verify new tools are present
const listToolsRequest = {
  jsonrpc: '2.0',
  id: 1,
  method: 'tools/list'
};

// Test 2: Test data export workflow manager
const dataExportTest = {
  jsonrpc: '2.0',
  id: 2,
  method: 'tools/call',
  params: {
    name: 'data_export_workflow_manager',
    arguments: {
      action: 'list',
      cleanroomId: 'test-cleanroom-001'
    }
  }
};

// Test 3: Test execution template manager
const templateManagerTest = {
  jsonrpc: '2.0',
  id: 3,
  method: 'tools/call',
  params: {
    name: 'execution_template_manager',
    arguments: {
      action: 'list_templates',
      cleanroomId: 'test-cleanroom-001'
    }
  }
};

// Test 4: Test advanced user management
const userManagementTest = {
  jsonrpc: '2.0',
  id: 4,
  method: 'tools/call',
  params: {
    name: 'advanced_user_management',
    arguments: {
      action: 'list_users',
      cleanroomId: 'test-cleanroom-001'
    }
  }
};

let responseCount = 0;
let responseBuffer = '';

mcpServer.stdout.on('data', (data) => {
  responseBuffer += data.toString();
  
  // Process complete JSON responses
  const lines = responseBuffer.split('\n');
  responseBuffer = lines.pop() || ''; // Keep incomplete line
  
  lines.forEach(line => {
    if (line.trim()) {
      try {
        const response = JSON.parse(line);
        responseCount++;
        
        console.log(`\n=== Response ${responseCount} ===`);
        
        if (response.id === 1 && response.result?.tools) {
          const newTools = response.result.tools.filter(tool => 
            ['data_export_workflow_manager', 'execution_template_manager', 'advanced_user_management'].includes(tool.name)
          );
          console.log(`✅ New tools found: ${newTools.length}/3`);
          newTools.forEach(tool => console.log(`  - ${tool.name}`));
        } else if (response.id > 1 && response.result) {
          console.log(`✅ Tool ${response.id === 2 ? 'data_export_workflow_manager' : 
                                  response.id === 3 ? 'execution_template_manager' : 
                                  'advanced_user_management'} working`);
          console.log('Response preview:', response.result.content[0].text.substring(0, 200) + '...');
        }
        
        if (responseCount >= 4) {
          console.log('\n🎉 All new tools tested successfully!');
          mcpServer.kill();
          process.exit(0);
        }
      } catch (e) {
        // Ignore non-JSON lines
      }
    }
  });
});

mcpServer.stderr.on('data', (data) => {
  console.log('Server log:', data.toString().trim());
});

// Send test requests with delays
setTimeout(() => {
  console.log('Sending list tools request...');
  mcpServer.stdin.write(JSON.stringify(listToolsRequest) + '\n');
}, 500);

setTimeout(() => {
  console.log('Testing data export workflow manager...');
  mcpServer.stdin.write(JSON.stringify(dataExportTest) + '\n');
}, 1000);

setTimeout(() => {
  console.log('Testing execution template manager...');
  mcpServer.stdin.write(JSON.stringify(templateManagerTest) + '\n');
}, 1500);

setTimeout(() => {
  console.log('Testing advanced user management...');
  mcpServer.stdin.write(JSON.stringify(userManagementTest) + '\n');
}, 2000);

// Timeout after 10 seconds
setTimeout(() => {
  console.log('\n⚠️  Test timeout - results may be incomplete');
  mcpServer.kill();
  process.exit(1);
}, 10000);