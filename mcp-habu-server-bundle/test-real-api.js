import { spawn } from 'child_process';

function testRealAPIMode() {
  console.log('🌐 Testing Real API Mode...');
  
  // Start the MCP server with real API enabled
  const server = spawn('node', ['dist/hybrid-index.js'], {
    stdio: ['pipe', 'pipe', 'pipe'],
    cwd: process.cwd(),
    env: { 
      ...process.env, 
      USE_REAL_API: 'true',
      HABU_API_TOKEN: 'bGzWYlAxXYPrSL8tsGQOP7ifCjr8eec1fiN-Jo_HpKPSUxeFSxfjIHq032c08SKC'
    }
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

  // Test authentication first
  setTimeout(() => {
    const authToolMessage = {
      jsonrpc: '2.0',
      id: 2,
      method: 'tools/call',
      params: {
        name: 'test_auth',
        arguments: {}
      }
    };
    
    console.log('📤 Testing authentication...');
    server.stdin.write(JSON.stringify(authToolMessage) + '\n');
  }, 2000);

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
          if (response.id === 2) {
            console.log('📥 Auth test result:');
            console.log(response.result?.content?.[0]?.text);
            
            // If auth succeeded, try running a query
            if (response.result?.content?.[0]?.text?.includes('✅')) {
              console.log('🎉 Authentication successful! Running query...');
              
              setTimeout(() => {
                const queryMessage = {
                  jsonrpc: '2.0',
                  id: 3,
                  method: 'tools/call',
                  params: {
                    name: 'run_query',
                    arguments: {}
                  }
                };
                server.stdin.write(JSON.stringify(queryMessage) + '\n');
              }, 1000);
            }
          } else if (response.id === 3) {
            console.log('📥 Query completed with real API!');
            console.log('Preview:', response.result?.content?.[0]?.text?.substring(0, 300) + '...');
          } else {
            console.log('📥 Server response ID', response.id + ':', response.result ? 'SUCCESS' : 'ERROR');
          }
        } catch (e) {
          console.log('📥 Raw response:', line);
        }
      }
    });
  });

  // Clean up after 30 seconds
  setTimeout(() => {
    console.log('🔚 Test complete, shutting down server...');
    server.kill();
  }, 30000);

  server.on('exit', (code) => {
    console.log(`✅ Server exited with code ${code}`);
  });
}

testRealAPIMode();