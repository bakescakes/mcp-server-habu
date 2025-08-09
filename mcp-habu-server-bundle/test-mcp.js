import { spawn } from 'child_process';

function testMCPServer() {
  console.log('🧪 Testing MCP Server...');
  
  // Start the MCP server
  const server = spawn('node', ['dist/index-with-mocks.js'], {
    stdio: ['pipe', 'pipe', 'pipe'],
    cwd: process.cwd()
  });

  // Handle server stderr (logging)
  server.stderr.on('data', (data) => {
    console.log('📋 Server log:', data.toString().trim());
  });

  // Send MCP initialization message
  const initMessage = {
    jsonrpc: '2.0',
    id: 1,
    method: 'initialize',
    params: {
      protocolVersion: '2024-11-05',
      capabilities: {
        tools: {}
      },
      clientInfo: {
        name: 'test-client',
        version: '1.0.0'
      }
    }
  };

  setTimeout(() => {
    console.log('📤 Sending initialization...');
    server.stdin.write(JSON.stringify(initMessage) + '\n');
  }, 1000);

  // Send list tools request
  setTimeout(() => {
    const listToolsMessage = {
      jsonrpc: '2.0',
      id: 2,
      method: 'tools/list',
      params: {}
    };
    
    console.log('📤 Requesting tools list...');
    server.stdin.write(JSON.stringify(listToolsMessage) + '\n');
  }, 2000);

  // Send tool call request
  setTimeout(() => {
    const callToolMessage = {
      jsonrpc: '2.0',
      id: 3,
      method: 'tools/call',
      params: {
        name: 'run_query',
        arguments: {}
      }
    };
    
    console.log('📤 Calling run_query tool...');
    server.stdin.write(JSON.stringify(callToolMessage) + '\n');
  }, 3000);

  // Handle server responses
  let buffer = '';
  server.stdout.on('data', (data) => {
    buffer += data.toString();
    const lines = buffer.split('\n');
    buffer = lines.pop(); // Keep incomplete line in buffer
    
    lines.forEach(line => {
      if (line.trim()) {
        try {
          const response = JSON.parse(line);
          console.log('📥 Server response:', JSON.stringify(response, null, 2));
        } catch (e) {
          console.log('📥 Raw response:', line);
        }
      }
    });
  });

  // Clean up after 15 seconds
  setTimeout(() => {
    console.log('🔚 Test complete, shutting down server...');
    server.kill();
  }, 15000);

  server.on('exit', (code) => {
    console.log(`✅ Server exited with code ${code}`);
  });
}

testMCPServer();