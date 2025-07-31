import { spawn } from 'child_process';

function testHybridMCPServer() {
  console.log('🧪 Testing Hybrid MCP Server...');
  
  // Start the MCP server
  const server = spawn('node', ['dist/hybrid-index.js'], {
    stdio: ['pipe', 'pipe', 'pipe'],
    cwd: process.cwd(),
    env: { ...process.env, USE_REAL_API: 'false' } // Ensure mock mode
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

  // Test run_query tool
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

  // Test test_auth tool
  setTimeout(() => {
    const authToolMessage = {
      jsonrpc: '2.0',
      id: 4,
      method: 'tools/call',
      params: {
        name: 'test_auth',
        arguments: {}
      }
    };
    
    console.log('📤 Calling test_auth tool...');
    server.stdin.write(JSON.stringify(authToolMessage) + '\n');
  }, 15000); // Wait for query to complete

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
          if (response.id === 3) {
            console.log('📥 Query result preview:', response.result?.content?.[0]?.text?.substring(0, 200) + '...');
          } else if (response.id === 4) {
            console.log('📥 Auth test result:', response.result?.content?.[0]?.text);
          } else {
            console.log('📥 Server response ID', response.id + ':', response.result ? 'SUCCESS' : 'ERROR');
          }
        } catch (e) {
          console.log('📥 Raw response:', line);
        }
      }
    });
  });

  // Clean up after 20 seconds
  setTimeout(() => {
    console.log('🔚 Test complete, shutting down server...');
    server.kill();
  }, 20000);

  server.on('exit', (code) => {
    console.log(`✅ Server exited with code ${code}`);
  });
}

testHybridMCPServer();