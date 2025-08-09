#!/usr/bin/env node

// Test if we can access the cleanroom CR-045487 directly

import axios from 'axios';

const CLIENT_ID = process.env.HABU_CLIENT_ID || process.env.HABU_API_KEY_PUBLISHER_SANDBOX || 'oTSkZnax86l8jfhzqillOBQk5MJ7zojh';
const CLIENT_SECRET = process.env.HABU_CLIENT_SECRET || process.env.HABU_API_KEY || 'bGzWYlAxXYPrSL8tsGQOP7ifCjr8eec1fiN-Jo_HpKPSUxeFSxfjIHq032c08SKC';
const API_BASE = 'https://api.habu.com/v1';

async function getAccessToken() {
    const credentials = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');
    
    const response = await axios.post(`${API_BASE}/oauth/token`, 
        'grant_type=client_credentials',
        {
            headers: {
                'Authorization': `Basic ${credentials}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }
    );
    
    return response.data.accessToken;
}

async function testDirectCleanroomAccess() {
    try {
        const token = await getAccessToken();
        const cleanroomId = 'CR-045487'; // From the UI screenshot
        
        console.log(`🎯 Testing direct access to cleanroom: ${cleanroomId}`);
        
        try {
            const response = await axios.get(`${API_BASE}/cleanrooms/${cleanroomId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            console.log('✅ Direct cleanroom access successful!');
            console.log('Status:', response.status);
            console.log('Cleanroom data:', JSON.stringify(response.data, null, 2));
            
        } catch (error) {
            console.log('❌ Direct cleanroom access failed');
            console.log('Status:', error.response?.status);
            console.log('Error:', error.response?.data?.message || error.message);
            
            if (error.response?.status === 404) {
                console.log('🔍 This confirms the cleanroom is not accessible with current credentials');
            } else if (error.response?.status === 403) {
                console.log('🔍 This indicates permission/authorization issue');
            }
        }
        
        // Also test if we can list questions for this cleanroom
        console.log(`\n🔍 Testing questions access for ${cleanroomId}:`);
        try {
            const questionsResponse = await axios.get(`${API_BASE}/cleanrooms/${cleanroomId}/cleanroom-questions`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            console.log('✅ Questions access successful!');
            console.log('Questions count:', questionsResponse.data?.length || 0);
            
        } catch (error) {
            console.log('❌ Questions access failed');
            console.log('Status:', error.response?.status);
            console.log('Error:', error.response?.data?.message || error.message);
        }
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
}

testDirectCleanroomAccess();