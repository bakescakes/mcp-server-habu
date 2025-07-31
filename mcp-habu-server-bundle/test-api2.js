import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const HABU_API_BASE_URL = process.env.HABU_API_BASE_URL || "https://api.habu.com/v1";
const HABU_API_TOKEN = process.env.HABU_API_TOKEN;

async function testAPI() {
  console.log("🔗 Testing Habu API connection...");
  console.log("Base URL:", HABU_API_BASE_URL);
  console.log("Token:", HABU_API_TOKEN?.substring(0, 10) + "...");
  
  // Try different authentication methods
  const authMethods = [
    { headers: { 'Authorization': `Bearer ${HABU_API_TOKEN}` }, name: 'Bearer' },
    { headers: { 'X-API-Key': HABU_API_TOKEN }, name: 'X-API-Key' },
    { headers: { 'Authorization': `Token ${HABU_API_TOKEN}` }, name: 'Token' },
    { headers: { 'Authorization': `API-Key ${HABU_API_TOKEN}` }, name: 'API-Key' },
    { headers: { 'apikey': HABU_API_TOKEN }, name: 'apikey' },
  ];
  
  for (const method of authMethods) {
    try {
      console.log(`\n🔑 Testing ${method.name} authentication...`);
      
      const habuApi = axios.create({
        baseURL: HABU_API_BASE_URL,
        headers: {
          ...method.headers,
          'Content-Type': 'application/json',
        },
      });
      
      const response = await habuApi.get('/cleanrooms');
      
      console.log("✅ API connection successful with", method.name);
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
        } else {
          console.log("❌ Target cleanroom CR-045487 not found");
          console.log("Available cleanrooms:", response.data.slice(0, 3).map(cr => ({
            displayId: cr.displayId,
            name: cr.name
          })));
        }
      }
      return; // Exit after successful auth
      
    } catch (error) {
      console.log(`❌ ${method.name} failed:`, error.response?.data?.message || error.message);
    }
  }
  
  console.log("❌ All authentication methods failed");
}

testAPI().catch(console.error);