import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const HABU_API_BASE_URL = process.env.HABU_API_BASE_URL || "https://api.habu.com/v1";
const HABU_API_TOKEN = process.env.HABU_API_TOKEN;

// Try different authentication methods
const authHeaders = [
  { 'Authorization': `Bearer ${HABU_API_TOKEN}`, name: 'Bearer' },
  { 'X-API-Key': HABU_API_TOKEN, name: 'X-API-Key' },
  { 'Authorization': `Token ${HABU_API_TOKEN}`, name: 'Token' },
  { 'Authorization': `API-Key ${HABU_API_TOKEN}`, name: 'API-Key' },
];

async function testAuth(headers, name) {
  const habuApi = axios.create({
    baseURL: HABU_API_BASE_URL,
    headers: {
      ...headers,
      'Content-Type': 'application/json',
    },
  });
  
  try {
    console.log(`\n🔑 Testing ${name} authentication...`);
    const response = await habuApi.get('/cleanrooms');
    return { success: true, response, name };
  } catch (error) {
    console.log(`❌ ${name} failed:`, error.response?.data?.message || error.message);
    return { success: false, error, name };
  }
}

async function testAPI() {
  console.log("🔗 Testing Habu API connection...");
  console.log("Base URL:", HABU_API_BASE_URL);
  console.log("Token:", HABU_API_TOKEN?.substring(0, 10) + "...");
  
  // Test different authentication methods
  for (const authHeader of authHeaders) {
    const result = await testAuth(authHeader, authHeader.name);
    if (result.success) {
      console.log("✅ API connection successful with", result.name);
      const response = result.response;
    console.log("✅ API connection successful!");
    console.log("Response status:", response.status);
    console.log("Number of cleanrooms:", response.data?.length || 0);
    
    if (response.data && response.data.length > 0) {
      console.log("First cleanroom:", {
        id: response.data[0].id,
        displayId: response.data[0].displayId,
        name: response.data[0].name
      });
      
      // Look for our target cleanroom
      const target = response.data.find(cr => cr.displayId === "CR-045487");
      if (target) {
        console.log("🎯 Found target cleanroom:", target.name);
        
        // Test cleanroom questions endpoint
        const questionsResponse = await habuApi.get(`/cleanrooms/${target.id}/cleanroom-questions`);
        console.log("✅ Questions endpoint works! Found", questionsResponse.data?.length || 0, "questions");
        
        // Look for our target question
        const targetQuestion = questionsResponse.data?.find(q => q.displayId === "CRQ-138038");
        if (targetQuestion) {
          console.log("🎯 Found target question:", targetQuestion.title);
        } else {
          console.log("❌ Target question CRQ-138038 not found");
          console.log("Available questions:", questionsResponse.data?.map(q => ({
            displayId: q.displayId,
            title: q.title
          })));
        }
      } else {
        console.log("❌ Target cleanroom CR-045487 not found");
        console.log("Available cleanrooms:", response.data.map(cr => ({
          displayId: cr.displayId,
          name: cr.name
        })));
      }
      return; // Exit after successful auth
    }
  }
  
  console.log("❌ All authentication methods failed");
}

testAPI();