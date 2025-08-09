#!/usr/bin/env node

// Debug clean room creation API request
const { HabuAuthenticator, createAuthConfig } = require('./mcp-habu-runner/dist/auth.js');

async function debugCleanRoomCreation() {
  console.log('🔍 Debugging Clean Room Creation API Request\n');

  // Initialize authenticator
  const CLIENT_ID = process.env.HABU_CLIENT_ID || 'oTSkZnax86l8jfhzqillOBQk5MJ7zojh';
  const CLIENT_SECRET = process.env.HABU_CLIENT_SECRET || 'bGzWYlAxXYPrSL8tsGQOP7ifCjr8eec1fiN-Jo_HpKPSUxeFSxfjIHq032c08SKC';

  if (!CLIENT_ID || !CLIENT_SECRET) {
    console.error('❌ Missing OAuth credentials');
    return;
  }

  try {
    const authConfig = createAuthConfig('oauth_client_credentials', CLIENT_ID, CLIENT_SECRET);
    const authenticator = new HabuAuthenticator(authConfig);
    const client = await authenticator.getAuthenticatedClient();

    // Build the exact request that failed
    const cleanRoomRequest = {
      name: "Memex Production Test",
      description: "Second clean room via fixed MCP wizard",
      startAt: "2025-07-26",
      endAt: "2025-12-31",
      type: "Hybrid",
      parameters: {
        REGION: "REGION_US",
        SUB_REGION: "SUB_REGION_EAST1",
        CLOUD: "CLOUD_AWS",
        ENABLE_EXPORT: "true",
        ENABLE_VIEW_QUERY: "true",
        ENABLE_HABU_INTELLIGENCE: "false",
        ENABLE_PAIR: "true",
        ENABLE_OPJA: "true",
        DATA_DECIBEL: Math.floor(parseFloat("2.0")).toString(),
        CROWD_SIZE: "50"
      }
    };

    console.log('📤 Request Body:');
    console.log(JSON.stringify(cleanRoomRequest, null, 2));
    
    console.log('\n🌐 Making API call to /cleanrooms...');
    
    try {
      const response = await client.post('/cleanrooms', cleanRoomRequest);
      console.log('✅ Success!');
      console.log('Response:', JSON.stringify(response.data, null, 2));
    } catch (apiError) {
      console.log('❌ API Error Details:');
      console.log('Status:', apiError.response?.status);
      console.log('Status Text:', apiError.response?.statusText);
      console.log('Headers:', apiError.response?.headers);
      console.log('Response Data:', JSON.stringify(apiError.response?.data, null, 2));
      
      // Try to understand the validation issue
      if (apiError.response?.data) {
        console.log('\n🔍 Error Analysis:');
        const errorData = apiError.response.data;
        if (errorData.message) {
          console.log('- Message:', errorData.message);
        }
        if (errorData.errors) {
          console.log('- Validation Errors:', errorData.errors);
        }
        if (errorData.details) {
          console.log('- Details:', errorData.details);
        }
      }
    }

  } catch (error) {
    console.error('❌ Setup Error:', error.message);
  }
}

debugCleanRoomCreation();