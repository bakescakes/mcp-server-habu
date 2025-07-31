import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const API_KEY_1 = "bGzWYlAxXYPrSL8tsGQOP7ifCjr8eec1fiN-Jo_HpKPSUxeFSxfjIHq032c08SKC";
const API_KEY_2 = "oTSkZnax86l8jfhzqillOBQk5MJ7zojh";

async function testDirectAuth() {
  console.log("🔑 Testing direct API key authentication methods...");
  
  const authMethods = [
    // Try different header formats
    { headers: { 'Authorization': `ApiKey ${API_KEY_1}` }, name: 'ApiKey header (key 1)' },
    { headers: { 'Authorization': `ApiKey ${API_KEY_2}` }, name: 'ApiKey header (key 2)' },
    { headers: { 'X-API-Key': API_KEY_1 }, name: 'X-API-Key header (key 1)' },
    { headers: { 'X-API-Key': API_KEY_2 }, name: 'X-API-Key header (key 2)' },
    { headers: { 'apikey': API_KEY_1 }, name: 'apikey header (key 1)' },
    { headers: { 'apikey': API_KEY_2 }, name: 'apikey header (key 2)' },
    
    // Try Basic Auth with keys
    { 
      headers: { 'Authorization': `Basic ${Buffer.from(`${API_KEY_1}:`).toString('base64')}` }, 
      name: 'Basic Auth with key 1 as username' 
    },
    { 
      headers: { 'Authorization': `Basic ${Buffer.from(`${API_KEY_2}:`).toString('base64')}` }, 
      name: 'Basic Auth with key 2 as username' 
    },
    { 
      headers: { 'Authorization': `Basic ${Buffer.from(`${API_KEY_1}:${API_KEY_2}`).toString('base64')}` }, 
      name: 'Basic Auth with key1:key2' 
    },
    { 
      headers: { 'Authorization': `Basic ${Buffer.from(`${API_KEY_2}:${API_KEY_1}`).toString('base64')}` }, 
      name: 'Basic Auth with key2:key1' 
    },
  ];
  
  for (const method of authMethods) {
    try {
      console.log(`\n🧪 Testing ${method.name}...`);
      
      const habuApi = axios.create({
        baseURL: "https://api.habu.com/v1",
        headers: {
          ...method.headers,
          'Content-Type': 'application/json',
        },
      });
      
      const response = await habuApi.get('/cleanrooms');
      console.log("✅ Success!");
      console.log("Response status:", response.status);
      console.log("Number of cleanrooms:", response.data?.length || 0);
      
      if (response.data && response.data.length > 0) {
        console.log("Sample cleanroom:", {
          id: response.data[0].id,
          displayId: response.data[0].displayId,
          name: response.data[0].name
        });
        
        // Look for our target cleanroom
        const target = response.data.find(cr => cr.displayId === "CR-045487");
        if (target) {
          console.log("🎯 Found target cleanroom:", target.name);
          
          // Test the questions endpoint too
          try {
            const questionsResponse = await habuApi.get(`/cleanrooms/${target.id}/cleanroom-questions`);
            console.log("✅ Questions endpoint works! Found", questionsResponse.data?.length || 0, "questions");
            
            const targetQuestion = questionsResponse.data?.find(q => q.displayId === "CRQ-138038");
            if (targetQuestion) {
              console.log("🎯 Found target question:", targetQuestion.title);
              console.log("\n🚀 AUTHENTICATION WORKING! You can use this method:");
              console.log("Headers:", JSON.stringify(method.headers, null, 2));
              return method.headers;
            }
          } catch (qError) {
            console.log("❓ Questions endpoint failed:", qError.response?.data?.message || qError.message);
          }
        }
      }
      
      return method.headers; // Return the working auth method
      
    } catch (error) {
      console.log(`❌ ${method.name} failed:`, error.response?.data?.message || error.message);
    }
  }
  
  console.log("\n❌ No direct authentication methods worked");
  return null;
}

async function testSpecialFormats() {
  console.log("\n🔍 Testing special authentication formats...");
  
  // Maybe the keys need to be decoded or formatted differently
  const specialMethods = [
    // Try treating the keys as base64 encoded values
    { 
      headers: { 'Authorization': `Bearer ${Buffer.from(API_KEY_1, 'base64').toString()}` }, 
      name: 'Bearer with base64 decoded key 1' 
    },
    { 
      headers: { 'Authorization': `Bearer ${Buffer.from(API_KEY_2, 'base64').toString()}` }, 
      name: 'Bearer with base64 decoded key 2' 
    },
    
    // Try treating them as hex
    { 
      headers: { 'Authorization': `Bearer ${Buffer.from(API_KEY_1, 'hex').toString()}` }, 
      name: 'Bearer with hex decoded key 1' 
    },
    
    // Try combining keys in different ways
    { 
      headers: { 'Authorization': `Bearer ${API_KEY_1}.${API_KEY_2}` }, 
      name: 'Bearer with combined keys (dot separator)' 
    },
    { 
      headers: { 'Authorization': `Bearer ${API_KEY_1}_${API_KEY_2}` }, 
      name: 'Bearer with combined keys (underscore separator)' 
    },
  ];
  
  for (const method of specialMethods) {
    try {
      console.log(`\n🧪 Testing ${method.name}...`);
      
      const habuApi = axios.create({
        baseURL: "https://api.habu.com/v1",
        headers: {
          ...method.headers,
          'Content-Type': 'application/json',
        },
      });
      
      const response = await habuApi.get('/cleanrooms');
      console.log("✅ Success with special format!");
      console.log("Headers:", JSON.stringify(method.headers, null, 2));
      return method.headers;
      
    } catch (error) {
      // Don't print errors for special formats to reduce noise
      // console.log(`❌ ${method.name} failed:`, error.response?.data?.message || error.message);
    }
  }
  
  return null;
}

async function runTests() {
  const workingAuth = await testDirectAuth();
  if (workingAuth) {
    console.log("\n🎉 Found working authentication!");
    return workingAuth;
  }
  
  const specialAuth = await testSpecialFormats();
  if (specialAuth) {
    console.log("\n🎉 Found working authentication with special format!");
    return specialAuth;
  }
  
  console.log("\n💭 Possible next steps:");
  console.log("1. Contact LiveRamp/Habu support for correct authentication method");
  console.log("2. Check if API keys need to be activated or whitelisted");
  console.log("3. Verify the API endpoint URL is correct");
  console.log("4. Check if there are additional required headers or parameters");
  
  return null;
}

runTests().catch(console.error);