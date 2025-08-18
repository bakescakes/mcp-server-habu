#!/usr/bin/env node

// Debug question permissions API request
const { HabuAuthenticator, createAuthConfig } = require('./mcp-habu-runner/dist/auth.js');

async function debugQuestionPermissions() {
  console.log('🔍 Debugging Question Permissions API Request\n');

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

    // First try WITHOUT question permissions
    console.log('📤 Testing without question permissions...');
    const cleanRoomRequestBasic = {
      name: "Debug Test Basic",
      description: "Testing without question permissions",
      startAt: "2025-07-25",
      type: "Hybrid",
      parameters: {
        REGION: "REGION_US",
        SUB_REGION: "SUB_REGION_EAST1",
        CLOUD: "CLOUD_AWS",
        ENABLE_EXPORT: "true",
        ENABLE_VIEW_QUERY: "true",
        ENABLE_HABU_INTELLIGENCE: "true",
        ENABLE_PAIR: "true",
        ENABLE_OPJA: "true",
        DATA_DECIBEL: "1",
        CROWD_SIZE: "50"
      }
    };

    try {
      const basicResponse = await client.post('/cleanrooms', cleanRoomRequestBasic);
      console.log('✅ Basic request successful!');
      console.log('ID:', basicResponse.data.id);
      console.log('Display ID:', basicResponse.data.displayId);
    } catch (basicError) {
      console.log('❌ Basic request failed:', basicError.response?.status, basicError.response?.statusText);
      console.log('Error:', basicError.response?.data);
    }

    // Now try WITH question permissions
    console.log('\n📤 Testing with question permissions...');
    const cleanRoomRequestWithPermissions = {
      name: "Debug Test With Permissions",
      description: "Testing with question permissions",
      startAt: "2025-07-25",
      type: "Hybrid",
      parameters: {
        REGION: "REGION_US",
        SUB_REGION: "SUB_REGION_EAST1",
        CLOUD: "CLOUD_AWS",
        ENABLE_EXPORT: "true",
        ENABLE_VIEW_QUERY: "true",
        ENABLE_HABU_INTELLIGENCE: "true",
        ENABLE_PAIR: "true",
        ENABLE_OPJA: "true",
        DATA_DECIBEL: "1",
        CROWD_SIZE: "50",
        // Try different permission parameter names
        ENABLE_VIEW_QUERY_CODE: "true",
        ENABLE_EDIT_DELETE_QUESTION: "true",
        ENABLE_CLONE_QUESTION: "true",
        ENABLE_SCHEDULE_RUNS: "true",
        ENABLE_VIEW_REPORTS: "true"
      }
    };

    try {
      const permissionsResponse = await client.post('/cleanrooms', cleanRoomRequestWithPermissions);
      console.log('✅ Permissions request successful!');
      console.log('ID:', permissionsResponse.data.id);
      console.log('Display ID:', permissionsResponse.data.displayId);
    } catch (permissionsError) {
      console.log('❌ Permissions request failed:', permissionsError.response?.status, permissionsError.response?.statusText);
      console.log('Error:', permissionsError.response?.data);
    }

  } catch (error) {
    console.error('❌ Setup Error:', error.message);
  }
}

debugQuestionPermissions();