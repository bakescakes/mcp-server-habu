#!/usr/bin/env node

// Direct check for CRQ-138029 runs using the API pattern that works in our MCP server

const { HabuAuthenticator } = await import('./mcp-habu-runner/dist/auth.js');

console.log('🔍 Checking CRQ-138029 Run Status');
console.log('=================================');

async function checkOptimalFrequencyRuns() {
  try {
    // Use the same authentication as our MCP server
    const authenticator = new HabuAuthenticator({
      baseUrl: 'https://api.habu.com/v1',
      method: 'oauth_client_credentials',
      credentials: {
        clientId: process.env.CLIENT_SECRET || 'oTSkZnax86l8jfhzqillOBQk5MJ7zojh',
        clientSecret: process.env.CLIENT_ID || 'bGzWYlAxXYPrSL8tsGQOP7ifCjr8eec1fiN-Jo_HpKPSUxeFSxfjIHq032c08SKC'
      }
    });

    const token = await authenticator.getAccessToken();
    console.log('✅ Authentication successful');

    // Get cleanrooms to find CR-045487
    const cleanroomsResponse = await fetch('https://api.habu.com/v1/cleanrooms', {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!cleanroomsResponse.ok) {
      throw new Error(`Failed to get cleanrooms: ${cleanroomsResponse.status}`);
    }

    const cleanrooms = await cleanroomsResponse.json();
    const targetCleanroom = cleanrooms.find(cr => cr.displayId === 'CR-045487');
    
    if (!targetCleanroom) {
      throw new Error('Could not find cleanroom CR-045487');
    }

    console.log('✅ Found cleanroom:', targetCleanroom.id);

    // Get questions in cleanroom
    const questionsResponse = await fetch(`https://api.habu.com/v1/cleanrooms/${targetCleanroom.id}/cleanroom-questions`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!questionsResponse.ok) {
      throw new Error(`Failed to get questions: ${questionsResponse.status}`);
    }

    const questions = await questionsResponse.json();
    const optimalFreqQuestion = questions.find(q => q.displayId === 'CRQ-138029');
    
    if (!optimalFreqQuestion) {
      throw new Error('Could not find CRQ-138029 question');
    }

    console.log('✅ Found optimal frequency question:', optimalFreqQuestion.id);
    console.log('   Display ID:', optimalFreqQuestion.displayId);
    console.log('   Name:', optimalFreqQuestion.name);

    // Get runs for this question
    const runsResponse = await fetch(`https://api.habu.com/v1/cleanroom-questions/${optimalFreqQuestion.id}/cleanroom-question-runs`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!runsResponse.ok) {
      throw new Error(`Failed to get question runs: ${runsResponse.status}`);
    }

    const runs = await runsResponse.json();
    console.log(`✅ Found ${runs.length} runs for CRQ-138029:`);
    
    runs.forEach((run, index) => {
      console.log(`\n   Run ${index + 1}:`);
      console.log(`   - ID: ${run.id}`);
      console.log(`   - Display ID: ${run.displayId || 'N/A'}`);
      console.log(`   - Status: ${run.status}`);
      console.log(`   - Created: ${run.createdAt}`);
      console.log(`   - Completed: ${run.completedAt || 'In progress'}`);
    });

    // Test individual run access for each run
    console.log('\n🔍 Testing individual run access:');
    for (const run of runs) {
      console.log(`\n   Testing run ${run.id}:`);
      
      try {
        const runResponse = await fetch(`https://api.habu.com/v1/cleanroom-question-runs/${run.id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        console.log(`   - Direct access: ${runResponse.status} ${runResponse.statusText}`);
        
        if (runResponse.ok) {
          const runData = await runResponse.json();
          console.log(`   - ✅ SUCCESS: Status = ${runData.status}`);
        } else {
          const errorText = await runResponse.text();
          console.log(`   - ❌ Error: ${errorText}`);
        }
      } catch (error) {
        console.log(`   - ❌ Exception: ${error.message}`);
      }
    }

  } catch (error) {
    console.error('❌ Check failed:', error.message);
  }
}

checkOptimalFrequencyRuns();