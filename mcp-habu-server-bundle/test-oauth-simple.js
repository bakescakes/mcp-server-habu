#!/usr/bin/env node

/**
 * Simple OAuth2 connectivity test for MCP Server for Habu
 * This script verifies that your credentials and API connection are working correctly.
 */

import axios from "axios";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Configuration
const HABU_API_BASE_URL = process.env.HABU_API_BASE_URL || "https://api.habu.com/v1";
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;

console.log("🚀 MCP Server for Habu - Connectivity Test");
console.log("=" .repeat(50));

// Validate environment
if (!CLIENT_ID || !CLIENT_SECRET) {
  console.log("❌ Missing credentials in .env file!");
  console.log("");
  console.log("Required environment variables:");
  console.log("  CLIENT_ID=your_client_id_here");
  console.log("  CLIENT_SECRET=your_client_secret_here");
  console.log("");
  console.log("Please edit your .env file and try again.");
  process.exit(1);
}

console.log("✅ Environment variables loaded");
console.log(`   API Base URL: ${HABU_API_BASE_URL}`);
console.log(`   Client ID: ${CLIENT_ID.substring(0, 8)}...`);
console.log(`   Client Secret: ${CLIENT_SECRET.substring(0, 8)}...`);
console.log("");

/**
 * Get OAuth2 access token using client credentials flow
 */
async function getOAuthToken() {
  try {
    console.log("🔑 Requesting OAuth2 access token...");
    
    const tokenResponse = await axios.post(`${HABU_API_BASE_URL}/oauth/token`, {
      grant_type: 'client_credentials'
    }, {
      auth: {
        username: CLIENT_ID,
        password: CLIENT_SECRET
      },
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    console.log("✅ OAuth2 token obtained successfully");
    console.log(`   Token type: ${tokenResponse.data.token_type}`);
    console.log(`   Expires in: ${tokenResponse.data.expires_in} seconds`);
    
    return tokenResponse.data.access_token;
  } catch (error) {
    console.log("❌ OAuth2 authentication failed");
    if (error.response) {
      console.log(`   Status: ${error.response.status}`);
      console.log(`   Error: ${JSON.stringify(error.response.data, null, 2)}`);
    } else {
      console.log(`   Error: ${error.message}`);
    }
    return null;
  }
}

/**
 * Test API connectivity with the access token
 */
async function testAPIConnectivity(accessToken) {
  try {
    console.log("🔍 Testing API connectivity...");
    
    const habuApi = axios.create({
      baseURL: HABU_API_BASE_URL,
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });
    
    // Test with cleanrooms endpoint
    const response = await habuApi.get('/cleanrooms');
    
    console.log("✅ API connection successful!");
    console.log(`   Found ${response.data?.length || 0} cleanrooms`);
    
    if (response.data && response.data.length > 0) {
      console.log("   Sample cleanroom:");
      const sample = response.data[0];
      console.log(`     ID: ${sample.id || 'N/A'}`);
      console.log(`     Name: ${sample.name || 'N/A'}`);
      console.log(`     Display ID: ${sample.displayId || 'N/A'}`);
    }
    
    return true;
  } catch (error) {
    console.log("❌ API connectivity test failed");
    if (error.response) {
      console.log(`   Status: ${error.response.status}`);
      console.log(`   Error: ${JSON.stringify(error.response.data, null, 2)}`);
    } else {
      console.log(`   Error: ${error.message}`);
    }
    return false;
  }
}

/**
 * Main test function
 */
async function runConnectivityTest() {
  try {
    // Step 1: Get OAuth token
    const accessToken = await getOAuthToken();
    if (!accessToken) {
      console.log("");
      console.log("🔧 Troubleshooting Tips:");
      console.log("   1. Verify your CLIENT_ID and CLIENT_SECRET are correct");
      console.log("   2. Contact your Habu administrator to confirm credentials");
      console.log("   3. Check if your network allows connections to api.habu.com");
      process.exit(1);
    }
    
    console.log("");
    
    // Step 2: Test API connectivity
    const apiSuccess = await testAPIConnectivity(accessToken);
    
    console.log("");
    console.log("=" .repeat(50));
    
    if (apiSuccess) {
      console.log("🎉 SUCCESS: Your MCP Server is ready!");
      console.log("");
      console.log("Next steps:");
      console.log("   1. Add this server to your MCP client configuration");
      console.log("   2. Try the test_connection tool in your MCP client");
      console.log("   3. Use list_cleanrooms to see your available clean rooms");
      console.log("");
      console.log("Available tools: 45 comprehensive clean room management tools");
    } else {
      console.log("❌ FAILED: API connectivity issues detected");
      console.log("");
      console.log("Please check your credentials and network connectivity.");
    }
    
  } catch (error) {
    console.log("❌ Unexpected error during connectivity test:");
    console.log(error.message);
    process.exit(1);
  }
}

// Run the test
runConnectivityTest();