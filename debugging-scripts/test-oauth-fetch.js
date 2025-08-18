#!/usr/bin/env node

/**
 * OAuth2 Authentication Test for Habu Clean Room API
 * Tests client credentials flow using API keys as client_id/client_secret
 */

// Use API keys as OAuth credentials
const CLIENT_ID = process.env.HABU_API_KEY || 'bGzWYlAxXYPrSL8tsGQOP7ifCjr8eec1fiN-Jo_HpKPSUxeFSxfjIHq032c08SKC';
const CLIENT_SECRET = process.env.HABU_API_KEY_SECONDARY || 'oTSkZnax86l8jfhzqillOBQk5MJ7zojh';

console.log('🔐 Testing OAuth2 Client Credentials Flow');
console.log('==========================================');
console.log('Token Endpoint: https://api.habu.com/v1/oauth/token');
console.log('Grant Type: client_credentials');
console.log(`Client ID: ${CLIENT_ID.substring(0, 20)}...`);
console.log(`Client Secret: ${CLIENT_SECRET ? CLIENT_SECRET.substring(0, 10) + '...' : 'Not provided'}`);
console.log('');

async function testOAuth2Authentication() {
  try {
    console.log('📡 Step 1: Requesting OAuth2 token...');
    
    // Try Basic Auth for client credentials (RFC 6749 standard)
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

    console.log('✅ Token request completed!');
    console.log(`Status: ${tokenResponse.status} ${tokenResponse.statusText}`);
    
    const tokenData = await tokenResponse.json();
    
    if (tokenResponse.ok && tokenData.access_token) {
      const accessToken = tokenData.access_token;
      console.log(`Access Token: ${accessToken.substring(0, 30)}...`);
      console.log(`Token Type: ${tokenData.token_type || 'bearer'}`);
      console.log(`Expires In: ${tokenData.expires_in || 'Unknown'} seconds`);
      
      // Test API call with token
      console.log('');
      console.log('📡 Step 2: Testing API call with OAuth token...');
      
      const apiResponse = await fetch('https://api.habu.com/v1/cleanrooms', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json'
        }
      });
      
      console.log(`API Response Status: ${apiResponse.status} ${apiResponse.statusText}`);
      
      if (apiResponse.ok) {
        const cleanroomsData = await apiResponse.json();
        console.log('✅ API call successful!');
        console.log(`Cleanrooms found: ${Array.isArray(cleanroomsData) ? cleanroomsData.length : 'Unknown format'}`);
        
        if (Array.isArray(cleanroomsData) && cleanroomsData.length > 0) {
          console.log('');
          console.log('📋 Sample cleanroom data:');
          const sample = cleanroomsData[0];
          console.log(`  ID: ${sample.id || sample.displayId || 'Unknown'}`);
          console.log(`  Name: ${sample.name || 'Unknown'}`);
          console.log(`  Status: ${sample.status || 'Unknown'}`);
          
          // Look for our target cleanroom
          const targetCleanroom = cleanroomsData.find(cr => 
            cr.displayId === 'CR-045487' || 
            cr.id === 'CR-045487' ||
            cr.name?.includes('Media Intelligence')
          );
          
          if (targetCleanroom) {
            console.log('');
            console.log('🎯 Found target cleanroom!');
            console.log(`  ID: ${targetCleanroom.id}`);
            console.log(`  Name: ${targetCleanroom.name}`);
            console.log(`  Status: ${targetCleanroom.status}`);
          } else {
            console.log('');
            console.log('⚠️  Target cleanroom CR-045487 not found in results');
          }
        }
        
        console.log('');
        console.log('🎉 OAuth2 authentication test SUCCESSFUL!');
        console.log('The MCP server can now use real API calls.');
        
      } else {
        const errorData = await apiResponse.text();
        console.log('❌ API call failed');
        console.log('Error response:', errorData);
      }
      
    } else {
      console.log('❌ OAuth2 token request failed');
      console.log('Response:', JSON.stringify(tokenData, null, 2));
      
      if (tokenResponse.status === 401) {
        console.log('');
        console.log('💡 Troubleshooting suggestions:');
        console.log('1. Verify your API keys are correct and active');
        console.log('2. Check if your organization has OAuth2 API access enabled');
        console.log('3. Ensure the keys have not expired');
        console.log('4. Try using the keys in different order (primary/secondary)');
      }
    }
    
  } catch (error) {
    console.log('');
    console.log('❌ OAuth2 authentication test FAILED');
    console.log('Error:', error.message);
    
    if (error.cause) {
      console.log('Cause:', error.cause);
    }
  }
}

// Alternative test with keys swapped
async function testWithSwappedKeys() {
  console.log('');
  console.log('🔄 Testing with swapped client credentials...');
  
  try {
    // Try with swapped credentials in Basic Auth
    const credentials = Buffer.from(`${CLIENT_SECRET}:${CLIENT_ID}`).toString('base64');
    
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
      console.log('✅ Swapped keys test successful!');
      console.log('Use CLIENT_SECRET as CLIENT_ID for OAuth2');
    } else {
      console.log('❌ Swapped keys test also failed');
      console.log(`Status: ${tokenResponse.status} ${tokenResponse.statusText}`);
    }
    
  } catch (error) {
    console.log('❌ Swapped keys test error:', error.message);
  }
}

// Run the tests
testOAuth2Authentication()
  .then(() => testWithSwappedKeys())
  .catch(console.error);