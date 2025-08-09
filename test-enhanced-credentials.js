#!/usr/bin/env node

// Test the enhanced credential management functionality
// This tests the new smart credential detection and user experience improvements

const { spawn } = require('child_process');
const path = require('path');

async function testEnhancedCredentials() {
    console.log('🧪 Testing Enhanced Credential Management\n');

    const mcpServerPath = path.join(__dirname, 'mcp-habu-runner', 'dist', 'index.js');
    
    console.log('📋 Test 1: List existing credentials before creating new connections...');
    
    // Test 1: List existing credentials
    const listCredentialsCall = {
        jsonrpc: "2.0",
        id: 1,
        method: "tools/call",
        params: {
            name: "create_aws_s3_connection",
            arguments: {
                connectionName: "Test Enhanced Credential Detection",
                category: "Customer Data",
                s3BucketPath: "s3://test-bucket/data/",
                fileFormat: "CSV",
                listExistingCredentials: true
            }
        }
    };

    console.log('\n🔍 Testing credential listing functionality...');
    await testMCPCall(mcpServerPath, listCredentialsCall, 'List Existing Credentials');

    console.log('\n🎯 Test 2: Smart auto-selection with single credential...');
    
    // Test 2: Smart auto-selection
    const autoSelectCall = {
        jsonrpc: "2.0",
        id: 2,
        method: "tools/call",
        params: {
            name: "create_aws_s3_connection",
            arguments: {
                connectionName: "Test Auto-Selection",
                category: "Customer Data", 
                s3BucketPath: "s3://test-bucket/data/",
                fileFormat: "CSV",
                useExistingCredential: true,
                dryRun: true
            }
        }
    };

    await testMCPCall(mcpServerPath, autoSelectCall, 'Smart Auto-Selection');

    console.log('\n⚠️  Test 3: Missing credential information handling...');
    
    // Test 3: Missing credential information
    const missingCredsCall = {
        jsonrpc: "2.0",
        id: 3,
        method: "tools/call",
        params: {
            name: "create_aws_s3_connection",
            arguments: {
                connectionName: "Test Missing Credentials",
                category: "Customer Data",
                s3BucketPath: "s3://test-bucket/data/",
                fileFormat: "CSV"
                // No credentials provided - should show enhanced guidance
            }
        }
    };

    await testMCPCall(mcpServerPath, missingCredsCall, 'Missing Credentials Guidance');

    console.log('\n🎉 Enhanced credential management testing completed!');
}

async function testMCPCall(serverPath, callData, testName) {
    return new Promise((resolve, reject) => {
        console.log(`\n📞 ${testName}:`);
        
        const server = spawn('node', [serverPath], {
            stdio: ['pipe', 'pipe', 'pipe']
        });

        let stdout = '';
        let stderr = '';

        server.stdout.on('data', (data) => {
            stdout += data.toString();
        });

        server.stderr.on('data', (data) => {
            stderr += data.toString();
        });

        // Send initialization
        const initMessage = {
            jsonrpc: "2.0",
            id: 0,
            method: "initialize",
            params: {
                protocolVersion: "2024-11-05",
                capabilities: {},
                clientInfo: {
                    name: "test-client",
                    version: "1.0.0"
                }
            }
        };

        server.stdin.write(JSON.stringify(initMessage) + '\n');
        
        // Wait a bit for initialization
        setTimeout(() => {
            server.stdin.write(JSON.stringify(callData) + '\n');
            
            setTimeout(() => {
                server.kill();
                
                try {
                    const responses = stdout.split('\n').filter(line => line.trim());
                    const lastResponse = responses[responses.length - 1];
                    
                    if (lastResponse) {
                        const parsed = JSON.parse(lastResponse);
                        if (parsed.result?.content?.[0]?.text) {
                            console.log('✅ Response received:');
                            const text = parsed.result.content[0].text;
                            // Show first few lines for brevity
                            const preview = text.split('\n').slice(0, 10).join('\n');
                            console.log(preview);
                            if (text.split('\n').length > 10) {
                                console.log('... (response continues)');
                            }
                        } else {
                            console.log('📄 Raw response:', lastResponse);
                        }
                    } else {
                        console.log('⚠️  No response received');
                        if (stderr) {
                            console.log('📝 Server log:', stderr.split('\n').slice(-3).join('\n'));
                        }
                    }
                } catch (e) {
                    console.log('❌ Error parsing response:', e.message);
                    if (stdout) {
                        console.log('📄 Raw stdout:', stdout.slice(-500));
                    }
                }
                
                resolve();
            }, 3000);
        }, 1000);
    });
}

// Run the tests
testEnhancedCredentials().catch(console.error);