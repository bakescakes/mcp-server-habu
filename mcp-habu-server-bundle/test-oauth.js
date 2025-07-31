import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const HABU_API_BASE_URL = process.env.HABU_API_BASE_URL || "https://api.habu.com/v1";
const CLIENT_ID = process.env.HABU_API_TOKEN; // Try using the API token as client ID
const CLIENT_SECRET = process.env.HABU_API_TOKEN; // Try using the API token as client secret

async function getOAuthToken() {
  try {
    console.log("🔑 Attempting OAuth2 client credentials flow...");
    
    const tokenResponse = await axios.post(`${HABU_API_BASE_URL}/oauth/token`, 
      new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
      }), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );
    
    console.log("✅ OAuth token obtained:", tokenResponse.data);
    return tokenResponse.data.access_token;
  } catch (error) {
    console.log("❌ OAuth failed:", error.response?.data || error.message);
    return null;
  }
}

async function testWithOAuth() {
  const accessToken = await getOAuthToken();
  if (!accessToken) {
    console.log("No access token obtained, cannot test API");
    return;
  }
  
  try {
    const habuApi = axios.create({
      baseURL: HABU_API_BASE_URL,
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });
    
    const response = await habuApi.get('/cleanrooms');
    console.log("✅ API connection successful with OAuth!");
    console.log("Number of cleanrooms:", response.data?.length || 0);
  } catch (error) {
    console.log("❌ API test with OAuth failed:", error.response?.data || error.message);
  }
}

testWithOAuth().catch(console.error);