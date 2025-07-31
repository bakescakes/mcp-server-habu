import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

// The API keys we have
const API_KEY_1 = "bGzWYlAxXYPrSL8tsGQOP7ifCjr8eec1fiN-Jo_HpKPSUxeFSxfjIHq032c08SKC";
const API_KEY_2 = "oTSkZnax86l8jfhzqillOBQk5MJ7zojh";

async function testOAuthPasswordGrant(accountId, secretKey, tokenUrl, description) {
  try {
    console.log(`\n🔑 Testing ${description}...`);
    
    const response = await axios.post(tokenUrl, new URLSearchParams({
      grant_type: 'password',
      username: accountId,
      password: secretKey,
      scope: 'openid',
      client_id: 'liveramp-api',
      response_type: 'token'
    }), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    
    console.log("✅ OAuth token obtained!");
    console.log("Token:", response.data.access_token?.substring(0, 20) + "...");
    console.log("Expires in:", response.data.expires_in, "seconds");
    
    return response.data.access_token;
  } catch (error) {
    console.log(`❌ ${description} failed:`, error.response?.data || error.message);
    return null;
  }
}

async function testAPIWithToken(token) {
  if (!token) return;
  
  try {
    console.log("\n🧪 Testing API with OAuth token...");
    
    const habuApi = axios.create({
      baseURL: "https://api.habu.com/v1",
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    
    const response = await habuApi.get('/cleanrooms');
    console.log("✅ API connection successful!");
    console.log("Number of cleanrooms:", response.data?.length || 0);
    
    if (response.data && response.data.length > 0) {
      console.log("Sample cleanroom:", {
        id: response.data[0].id,
        displayId: response.data[0].displayId,
        name: response.data[0].name
      });
    }
    
    return true;
  } catch (error) {
    console.log("❌ API test failed:", error.response?.data || error.message);
    return false;
  }
}

async function testClientCredentialsGrant(clientId, clientSecret, tokenUrl, description) {
  try {
    console.log(`\n🔑 Testing ${description}...`);
    
    const response = await axios.post(tokenUrl, new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: clientId,
      client_secret: clientSecret,
    }), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    
    console.log("✅ OAuth token obtained!");
    console.log("Token:", response.data.access_token?.substring(0, 20) + "...");
    console.log("Expires in:", response.data.expires_in, "seconds");
    
    return response.data.access_token;
  } catch (error) {
    console.log(`❌ ${description} failed:`, error.response?.data || error.message);
    return null;
  }
}

async function runAuthTests() {
  console.log("🚀 Testing different LiveRamp authentication methods...");
  
  // OAuth endpoints to try
  const endpoints = [
    { url: "https://sso.liveramp.com/oauth2/default/v1/token", name: "SSO v1" },
    { url: "https://serviceaccounts.liveramp.com/authn/v1/oauth2/token", name: "Service Accounts v2" },
    { url: "https://us.identity.api.liveramp.com/token", name: "AbiliTec Identity API" },
    { url: "https://api.habu.com/v1/oauth/token", name: "Habu Direct OAuth" }
  ];
  
  // Test 1: OAuth Password Grant (treating API keys as username/password)
  for (const endpoint of endpoints) {
    const token = await testOAuthPasswordGrant(API_KEY_1, API_KEY_2, endpoint.url, `OAuth Password Grant - ${endpoint.name}`);
    if (token) {
      const success = await testAPIWithToken(token);
      if (success) return; // Exit on first success
    }
  }
  
  // Test 2: Client Credentials Grant (treating API keys as client_id/client_secret)
  for (const endpoint of endpoints) {
    const token = await testClientCredentialsGrant(API_KEY_1, API_KEY_2, endpoint.url, `OAuth Client Credentials - ${endpoint.name}`);
    if (token) {
      const success = await testAPIWithToken(token);
      if (success) return; // Exit on first success
    }
  }
  
  // Test 3: Try reverse order of keys
  for (const endpoint of endpoints) {
    const token = await testOAuthPasswordGrant(API_KEY_2, API_KEY_1, endpoint.url, `OAuth Password Grant (reversed) - ${endpoint.name}`);
    if (token) {
      const success = await testAPIWithToken(token);
      if (success) return; // Exit on first success
    }
    
    const token2 = await testClientCredentialsGrant(API_KEY_2, API_KEY_1, endpoint.url, `OAuth Client Credentials (reversed) - ${endpoint.name}`);
    if (token2) {
      const success = await testAPIWithToken(token2);
      if (success) return; // Exit on first success
    }
  }
  
  console.log("\n❌ All authentication methods failed");
  console.log("🔍 You may need to contact LiveRamp support for the correct authentication method");
  console.log("💡 Or the API keys might need to be registered/activated first");
}

runAuthTests().catch(console.error);