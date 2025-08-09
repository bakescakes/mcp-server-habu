#!/usr/bin/env node

// Debug script to test different run ID endpoints and formats

// Use swapped API keys as OAuth credentials (working configuration)
const CLIENT_ID = process.env.HABU_API_KEY_SECONDARY || 'oTSkZnax86l8jfhzqillOBQk5MJ7zojh';
const CLIENT_SECRET = process.env.HABU_API_KEY || 'bGzWYlAxXYPrSL8tsGQOP7ifCjr8eec1fiN-Jo_HpKPSUxeFSxfjIHq032c08SKC';
const TARGET_CLEANROOM_DISPLAY_ID = "CR-045487";

console.log('🔍 Testing Run ID Endpoints');
console.log('==========================');
console.log(`Clean Room: ${TARGET_CLEANROOM_DISPLAY_ID}`);
console.log('');

async function testRunIdEndpoints() {
  try {
    // Step 1: Get OAuth2 token
    console.log('📡 Step 1: Getting OAuth2 token...');
    const authResponse = await fetch('https://api.habu.com/v1/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`
      },
      body: 'grant_type=client_credentials'
    });

    if (!authResponse.ok) {
      const errorText = await authResponse.text();
      console.log('❌ OAuth2 failed:', authResponse.status, errorText);
      return;
    }

    const tokenData = await authResponse.json();
    const accessToken = tokenData.access_token;
    console.log('✅ OAuth2 token obtained!');
    console.log('');

    // Step 2: Get cleanroom UUID
    console.log('📡 Step 2: Finding cleanroom UUID...');
    const cleanroomsResponse = await fetch('https://api.habu.com/v1/cleanrooms', {
      headers: { 'Authorization': `Bearer ${accessToken}` }
    });

    if (!cleanroomsResponse.ok) {
      console.log('❌ Failed to get cleanrooms:', cleanroomsResponse.status);
      return;
    }

    const cleanroomsData = await cleanroomsResponse.json();
    const targetCleanroom = cleanroomsData.find(cr => cr.displayId === TARGET_CLEANROOM_DISPLAY_ID);
    
    if (!targetCleanroom) {
      console.log('❌ Could not find cleanroom');
      return;
    }

    console.log('✅ Found cleanroom UUID:', targetCleanroom.id);
    console.log('');

    // Step 3: Test different run ID formats and endpoints
    const runIds = [
      'MCP_Run_1753844461752',  // From screenshot
      '633c54f8-c848-44c6-8d03-5894c0fc850f', // From our original execution
      '1753844461752'  // Just the number part
    ];

    const endpointPatterns = [
      '/cleanroom-question-runs/{runId}',
      '/cleanrooms/{cleanroomId}/question-runs/{runId}',
      '/cleanrooms/{cleanroomId}/cleanroom-question-runs/{runId}',
      '/question-runs/{runId}',
      '/cleanroom-question-runs/{runId}/status',
      '/cleanroom-question-runs/{runId}/data'
    ];

    for (const runId of runIds) {
      console.log(`🔍 Testing Run ID: ${runId}`);
      console.log('─'.repeat(50));
      
      for (const pattern of endpointPatterns) {
        const endpoint = pattern
          .replace('{cleanroomId}', targetCleanroom.id)
          .replace('{runId}', runId);
        
        console.log(`   Testing: ${endpoint}`);
        
        try {
          const response = await fetch(`https://api.habu.com/v1${endpoint}`, {
            headers: { 'Authorization': `Bearer ${accessToken}` }
          });

          console.log(`   Status: ${response.status} ${response.statusText}`);
          
          if (response.ok) {
            const data = await response.json();
            console.log(`   ✅ SUCCESS! Response:`, JSON.stringify(data, null, 2).substring(0, 200) + '...');
          } else if (response.status !== 404) {
            // Show non-404 errors as they might be informative
            const errorText = await response.text();
            console.log(`   ⚠️  Error: ${errorText.substring(0, 100)}`);
          }
        } catch (error) {
          console.log(`   ❌ Request failed: ${error.message}`);
        }
      }
      console.log('');
    }

    // Step 4: Try to get all questions and their runs to see what the structure looks like
    console.log('📡 Step 4: Getting question structure...');
    
    try {
      const questionsResponse = await fetch(`https://api.habu.com/v1/cleanrooms/${targetCleanroom.id}/cleanroom-questions`, {
        headers: { 'Authorization': `Bearer ${accessToken}` }
      });

      if (questionsResponse.ok) {
        const questionsData = await questionsResponse.json();
        console.log(`✅ Found ${questionsData.length} questions in cleanroom`);
        
        // Find the optimal frequency question
        const optimalFreqQuestion = questionsData.find(q => 
          q.displayId === 'CRQ-138029' || 
          q.name?.includes('optimal frequency')
        );
        
        if (optimalFreqQuestion) {
          console.log('✅ Found optimal frequency question:', optimalFreqQuestion.displayId);
          console.log('   Question ID:', optimalFreqQuestion.id);
          
          // Try to get runs for this specific question
          const questionRunsResponse = await fetch(`https://api.habu.com/v1/cleanroom-questions/${optimalFreqQuestion.id}/cleanroom-question-runs`, {
            headers: { 'Authorization': `Bearer ${accessToken}` }
          });
          
          if (questionRunsResponse.ok) {
            const runsData = await questionRunsResponse.json();
            console.log(`✅ Found ${runsData.length} runs for this question:`);
            runsData.forEach((run, index) => {
              console.log(`   Run ${index + 1}: ${run.id} - Status: ${run.status}`);
              console.log(`             Display ID: ${run.displayId || 'N/A'}`);
              console.log(`             Created: ${run.createdAt || 'N/A'}`);
            });
          } else {
            console.log('❌ Failed to get question runs:', questionRunsResponse.status);
          }
        }
      }
    } catch (error) {
      console.log('❌ Question structure query failed:', error.message);
    }

  } catch (error) {
    console.error('❌ Debug test failed:', error);
  }
}

testRunIdEndpoints();