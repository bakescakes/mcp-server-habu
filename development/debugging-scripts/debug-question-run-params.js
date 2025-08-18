#!/usr/bin/env node

/**
 * Debug Question Run Parameter Passing
 * Tests the exact same API call that the MCP server makes for execute_question_run
 */

require('dotenv').config({ path: './mcp-habu-runner/.env' });

// Use the working credentials from the test-oauth.js pattern
const CLIENT_ID = process.env.HABU_API_KEY || 'bGzWYlAxXYPrSL8tsGQOP7ifCjr8eec1fiN-Jo_HpKPSUxeFSxfjIHq032c08SKC';
const CLIENT_SECRET = process.env.HABU_API_KEY_SECONDARY || 'oTSkZnax86l8jfhzqillOBQk5MJ7zojh';

console.log('🔑 Using credentials:');
console.log(`CLIENT_ID: ${CLIENT_ID.substring(0, 20)}...`);
console.log(`CLIENT_SECRET: ${CLIENT_SECRET.substring(0, 10)}...`);

// OAuth2 Authentication
async function getAccessToken() {
  console.log('🔐 Getting OAuth2 token...');
  
  const tokenParams = new URLSearchParams({
    grant_type: 'client_credentials',
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
  });

  const response = await fetch('https://api.habu.com/v1/oauth/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json'
    },
    body: tokenParams
  });

  if (!response.ok) {
    throw new Error(`Token request failed: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  console.log('✅ OAuth2 token obtained');
  return data.access_token;
}

// Test Question Run with Parameters
async function testQuestionRunWithParams() {
  try {
    const token = await getAccessToken();
    
    // Test parameters - exactly what we used in the MCP tool
    const testCases = [
      {
        name: "CRQ-138033 (First Touch Attribution)",
        questionId: "c9013f1e-b7f7-4d1d-b352-73324654c554", // UUID for CRQ-138033
        parameters: {
          "click_attribution_window": "14",
          "imp_attribution_window": "14"
        },
        partitionParameters: [
          {"name": "exposures.date_start", "value": "2024-01-01"},
          {"name": "exposures.date_end", "value": "2024-01-31"},
          {"name": "conversions.date_start", "value": "2024-01-01"},
          {"name": "conversions.date_end", "value": "2024-02-14"}
        ]
      },
      {
        name: "CRQ-138038 (Attribute Overlap)",
        questionId: "10640fe6-e4fd-43fe-b624-8816a0ed4faf", // UUID for CRQ-138038
        parameters: {
          "CRM_ATTRIBUTE": "EDUCATION"
        },
        partitionParameters: [
          {"name": "exposures.date_start", "value": "2024-01-01"},
          {"name": "exposures.date_end", "value": "2024-01-31"}
        ]
      },
      {
        name: "CRQ-138037 (Simple Reach)",
        questionId: "9a506ecb-4b21-4e48-ba97-916edc43aea0", // UUID for CRQ-138037
        parameters: {},
        partitionParameters: [
          {"name": "exposures.date_start", "value": "2024-01-01"},
          {"name": "exposures.date_end", "value": "2024-01-31"}
        ]
      }
    ];

    for (const testCase of testCases) {
      console.log(`\n🧪 Testing: ${testCase.name}`);
      console.log(`Question ID: ${testCase.questionId}`);
      
      const requestBody = {
        name: `Debug_Run_${Date.now()}`,
        parameters: testCase.parameters,
        partitionParameters: testCase.partitionParameters
      };
      
      console.log('📤 Request Body:');
      console.log(JSON.stringify(requestBody, null, 2));
      
      const response = await fetch(`https://api.habu.com/v1/cleanroom-questions/${testCase.questionId}/create-run`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });
      
      console.log(`📊 Response Status: ${response.status} ${response.statusText}`);
      
      if (response.ok) {
        const runData = await response.json();
        console.log('✅ Run created successfully!');
        console.log(`   Run ID: ${runData.id}`);
        console.log(`   Status: ${runData.status}`);
        
        // Check the run details to see if parameters were properly received
        const detailsResponse = await fetch(`https://api.habu.com/v1/cleanroom-question-runs/${runData.id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (detailsResponse.ok) {
          const details = await detailsResponse.json();
          console.log('📋 Run Details:');
          console.log(`   Parameters: ${JSON.stringify(details.parameters || {})}`);
          console.log(`   Partition Parameters: ${JSON.stringify(details.partitionParameters || [])}`);
        }
      } else {
        const errorText = await response.text();
        console.log('❌ Run creation failed:');
        console.log(`   Error: ${errorText}`);
      }
      
      // Wait a bit between requests
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testQuestionRunWithParams();