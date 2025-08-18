#!/usr/bin/env node

/**
 * Complete OAuth2 + API Workflow Test for Habu Clean Room API
 * Tests the full authentication and API call sequence
 */

// Use correctly ordered OAuth credentials (discovered through testing)
const CLIENT_ID = 'oTSkZnax86l8jfhzqillOBQk5MJ7zojh';     // Secondary key as client_id
const CLIENT_SECRET = 'bGzWYlAxXYPrSL8tsGQOP7ifCjr8eec1fiN-Jo_HpKPSUxeFSxfjIHq032c08SKC'; // Primary key as client_secret

console.log('🚀 Testing Complete OAuth2 + API Workflow');
console.log('============================================');
console.log('This test validates the complete authentication and API call sequence');
console.log('that will be used by the MCP server for real API integration.');
console.log('');

let accessToken = null;

async function step1_OAuth2Authentication() {
  console.log('📡 Step 1: OAuth2 Authentication');
  console.log('Token Endpoint: https://api.habu.com/v1/oauth/token');
  console.log('Grant Type: client_credentials with Basic Auth');
  console.log('');
  
  try {
    const credentials = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');
    
    const tokenParams = new URLSearchParams({
      grant_type: 'client_credentials'
    });

    const tokenResponse = await fetch('https://api.habu.com/v1/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
        'Authorization': `Basic ${credentials}`
      },
      body: tokenParams.toString()
    });

    if (tokenResponse.ok) {
      const tokenData = await tokenResponse.json();
      
      if (tokenData.accessToken || tokenData.access_token) {
        accessToken = tokenData.accessToken || tokenData.access_token;
        
        console.log('✅ OAuth2 authentication successful!');
        console.log(`   Access Token: ${accessToken.substring(0, 30)}...`);
        console.log(`   Token Type: ${tokenData.token_type || 'bearer'}`);
        console.log(`   Expires In: ${tokenData.expires_in || 'Unknown'} seconds`);
        console.log('');
        return true;
      } else {
        console.log('❌ No access token in response');
        console.log('   Response:', JSON.stringify(tokenData, null, 2));
        return false;
      }
    } else {
      const errorData = await tokenResponse.json();
      console.log('❌ OAuth2 authentication failed!');
      console.log(`   Status: ${tokenResponse.status} ${tokenResponse.statusText}`);
      console.log(`   Error: ${JSON.stringify(errorData, null, 2)}`);
      return false;
    }
    
  } catch (error) {
    console.log('❌ OAuth2 authentication error:', error.message);
    return false;
  }
}

async function step2_ListCleanrooms() {
  console.log('📡 Step 2: List Cleanrooms');
  console.log('Endpoint: GET /cleanrooms');
  console.log('');
  
  try {
    const response = await fetch('https://api.habu.com/v1/cleanrooms', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json'
      }
    });
    
    if (response.ok) {
      const cleanrooms = await response.json();
      console.log('✅ Cleanrooms retrieved successfully!');
      console.log(`   Total cleanrooms: ${Array.isArray(cleanrooms) ? cleanrooms.length : 'Unknown'}`);
      
      if (Array.isArray(cleanrooms) && cleanrooms.length > 0) {
        console.log('   Sample cleanroom:');
        const sample = cleanrooms[0];
        console.log(`     ID: ${sample.id}`);
        console.log(`     Name: ${sample.name}`);
        console.log(`     Status: ${sample.status}`);
        
        // Look for target cleanroom
        const target = cleanrooms.find(cr => 
          cr.displayId === 'CR-045487' || 
          cr.id === 'CR-045487' ||
          cr.name?.includes('Media Intelligence')
        );
        
        if (target) {
          console.log('');
          console.log('🎯 Target cleanroom found!');
          console.log(`   ID: ${target.id}`);
          console.log(`   Name: ${target.name}`);
          console.log(`   Status: ${target.status}`);
          console.log('');
          return target;
        } else {
          console.log('');
          console.log('⚠️  Target cleanroom CR-045487 not found');
          console.log('   Available cleanrooms:');
          cleanrooms.slice(0, 5).forEach(cr => {
            console.log(`     - ${cr.id || cr.displayId}: ${cr.name}`);
          });
          console.log('');
          return cleanrooms[0]; // Use first available for testing
        }
      }
    } else {
      const errorText = await response.text();
      console.log('❌ Failed to retrieve cleanrooms');
      console.log(`   Status: ${response.status} ${response.statusText}`);
      console.log(`   Error: ${errorText}`);
      return null;
    }
    
  } catch (error) {
    console.log('❌ Error retrieving cleanrooms:', error.message);
    return null;
  }
}

async function step3_ListQuestions(cleanroomId) {
  console.log('📡 Step 3: List Cleanroom Questions');
  console.log(`Endpoint: GET /cleanrooms/${cleanroomId}/cleanroom-questions`);
  console.log('');
  
  try {
    const response = await fetch(`https://api.habu.com/v1/cleanrooms/${cleanroomId}/cleanroom-questions`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json'
      }
    });
    
    if (response.ok) {
      const questions = await response.json();
      console.log('✅ Questions retrieved successfully!');
      console.log(`   Total questions: ${Array.isArray(questions) ? questions.length : 'Unknown'}`);
      
      if (Array.isArray(questions) && questions.length > 0) {
        console.log('   Sample question:');
        const sample = questions[0];
        console.log(`     ID: ${sample.id}`);
        console.log(`     Name: ${sample.name}`);
        console.log(`     Status: ${sample.status}`);
        
        // Look for target question
        const target = questions.find(q => 
          q.displayId === 'CRQ-138038' || 
          q.id === 'CRQ-138038' ||
          q.name?.includes('Attribute Level Overlap')
        );
        
        if (target) {
          console.log('');
          console.log('🎯 Target question found!');
          console.log(`   ID: ${target.id}`);
          console.log(`   Name: ${target.name}`);
          console.log(`   Type: ${target.questionType}`);
          console.log('');
          return target;
        } else {
          console.log('');
          console.log('⚠️  Target question CRQ-138038 not found');
          console.log('   Available questions:');
          questions.slice(0, 5).forEach(q => {
            console.log(`     - ${q.id || q.displayId}: ${q.name}`);
          });
          console.log('');
          return questions[0]; // Use first available for testing
        }
      }
    } else {
      const errorText = await response.text();
      console.log('❌ Failed to retrieve questions');
      console.log(`   Status: ${response.status} ${response.statusText}`);
      console.log(`   Error: ${errorText}`);
      return null;
    }
    
  } catch (error) {
    console.log('❌ Error retrieving questions:', error.message);
    return null;
  }
}

async function step4_CreateRun(questionId) {
  console.log('📡 Step 4: Create Question Run');
  console.log(`Endpoint: POST /cleanroom-questions/${questionId}/create-run`);
  console.log('');
  
  try {
    const runData = {
      name: `OAuth Test Run - ${new Date().toISOString()}`,
      parameters: {}
    };
    
    const response = await fetch(`https://api.habu.com/v1/cleanroom-questions/${questionId}/create-run`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(runData)
    });
    
    if (response.ok) {
      const run = await response.json();
      console.log('✅ Question run created successfully!');
      console.log(`   Run ID: ${run.id}`);
      console.log(`   Name: ${run.name}`);
      console.log(`   Status: ${run.status}`);
      console.log('');
      return run;
    } else {
      const errorText = await response.text();
      console.log('❌ Failed to create question run');
      console.log(`   Status: ${response.status} ${response.statusText}`);
      console.log(`   Error: ${errorText}`);
      return null;
    }
    
  } catch (error) {
    console.log('❌ Error creating question run:', error.message);
    return null;
  }
}

async function step5_MonitorRun(runId) {
  console.log('📡 Step 5: Monitor Run Status');
  console.log(`Endpoint: GET /cleanroom-question-runs/${runId}`);
  console.log('');
  
  try {
    const response = await fetch(`https://api.habu.com/v1/cleanroom-question-runs/${runId}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json'
      }
    });
    
    if (response.ok) {
      const runStatus = await response.json();
      console.log('✅ Run status retrieved successfully!');
      console.log(`   Run ID: ${runStatus.id}`);
      console.log(`   Status: ${runStatus.status}`);
      console.log(`   Submitted: ${runStatus.submittedAt}`);
      if (runStatus.completedAt) {
        console.log(`   Completed: ${runStatus.completedAt}`);
      }
      console.log('');
      return runStatus;
    } else {
      const errorText = await response.text();
      console.log('❌ Failed to retrieve run status');
      console.log(`   Status: ${response.status} ${response.statusText}`);
      console.log(`   Error: ${errorText}`);
      return null;
    }
    
  } catch (error) {
    console.log('❌ Error retrieving run status:', error.message);
    return null;
  }
}

// Main test execution
async function runCompleteTest() {
  try {
    // Step 1: Authenticate
    const authSuccess = await step1_OAuth2Authentication();
    if (!authSuccess) {
      console.log('🛑 Test failed at authentication step');
      return;
    }
    
    // Step 2: List cleanrooms
    const cleanroom = await step2_ListCleanrooms();
    if (!cleanroom) {
      console.log('🛑 Test failed at cleanrooms step');
      return;
    }
    
    // Step 3: List questions
    const question = await step3_ListQuestions(cleanroom.id);
    if (!question) {
      console.log('🛑 Test failed at questions step');
      return;
    }
    
    // Step 4: Create run
    const run = await step4_CreateRun(question.id);
    if (!run) {
      console.log('🛑 Test failed at create run step');
      return;
    }
    
    // Step 5: Monitor run
    const runStatus = await step5_MonitorRun(run.id);
    if (!runStatus) {
      console.log('🛑 Test failed at monitor run step');
      return;
    }
    
    console.log('🎉 Complete OAuth2 + API workflow test SUCCESSFUL!');
    console.log('');
    console.log('✅ All authentication and API endpoints are working correctly');
    console.log('✅ The MCP server can now use real API calls for production');
    console.log('✅ OAuth2 client credentials flow is properly implemented');
    console.log('');
    console.log('🚀 Ready to update MCP server to USE_REAL_API=true');
    
  } catch (error) {
    console.log('🛑 Test failed with error:', error.message);
  }
}

runCompleteTest();