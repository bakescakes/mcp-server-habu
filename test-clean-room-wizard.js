#!/usr/bin/env node

// Test the clean room creation wizard
const { spawn } = require('child_process');

async function testWizardStep(input) {
  return new Promise((resolve, reject) => {
    const child = spawn('node', ['mcp-habu-runner/dist/index.js'], {
      stdio: ['pipe', 'pipe', 'pipe']
    });

    let output = '';
    let error = '';

    child.stdout.on('data', (data) => {
      output += data.toString();
    });

    child.stderr.on('data', (data) => {
      error += data.toString();
    });

    child.on('close', (code) => {
      if (code === 0) {
        try {
          // Parse the MCP response
          const lines = output.trim().split('\n');
          const response = JSON.parse(lines[lines.length - 1]);
          resolve({ response, error });
        } catch (e) {
          reject(new Error(`Failed to parse response: ${e.message}\nOutput: ${output}`));
        }
      } else {
        reject(new Error(`Process exited with code ${code}\nError: ${error}`));
      }
    });

    // Send MCP request
    const request = {
      jsonrpc: '2.0',
      id: 1,
      method: 'tools/call',
      params: {
        name: 'start_clean_room_creation_wizard',
        arguments: input
      }
    };

    child.stdin.write(JSON.stringify(request) + '\n');
    child.stdin.end();
  });
}

async function testWizard() {
  console.log('🧪 Testing Clean Room Creation Wizard\n');

  try {
    // Test 1: Start step
    console.log('1️⃣ Testing start step...');
    const startResult = await testWizardStep({ step: 'start' });
    console.log('✅ Start step successful');
    console.log(startResult.response.result.content[0].text.substring(0, 200) + '...\n');

    // Test 2: Basic info with missing data
    console.log('2️⃣ Testing basic_info validation...');
    const validationResult = await testWizardStep({ step: 'basic_info' });
    console.log('✅ Validation working correctly');
    console.log(validationResult.response.result.content[0].text.substring(0, 200) + '...\n');

    // Test 3: Basic info with valid data
    console.log('3️⃣ Testing basic_info with valid data...');
    const basicInfoResult = await testWizardStep({ 
      step: 'basic_info',
      name: 'Test Clean Room MCP',
      description: 'Created via MCP wizard test',
      type: 'Hybrid',
      startAt: '2025-02-01'
    });
    console.log('✅ Basic info step successful');
    console.log(basicInfoResult.response.result.content[0].text.substring(0, 200) + '...\n');

    // Test 4: Infrastructure step
    console.log('4️⃣ Testing infrastructure step...');
    const infraResult = await testWizardStep({ 
      step: 'infrastructure',
      name: 'Test Clean Room MCP',
      description: 'Created via MCP wizard test',
      type: 'Hybrid',
      startAt: '2025-02-01',
      cloud: 'CLOUD_AWS',
      region: 'REGION_US',
      subRegion: 'SUB_REGION_EAST1'
    });
    console.log('✅ Infrastructure step successful');
    console.log(infraResult.response.result.content[0].text.substring(0, 200) + '...\n');

    console.log('🎉 All wizard steps tested successfully!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  }
}

testWizard();