#!/usr/bin/env node

// Test the question runs endpoint to understand the correct API path

import dotenv from 'dotenv';
dotenv.config({ path: './mcp-habu-runner/.env' });

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const TARGET_CLEANROOM_DISPLAY_ID = "CR-045487";

console.log('🔍 Testing Question Runs Endpoint');
console.log('=====================================');
console.log(`Clean Room Display ID: ${TARGET_CLEANROOM_DISPLAY_ID}`);
console.log('Client ID:', CLIENT_ID?.substring(0, 20) + '...');
console.log('Client Secret:', CLIENT_SECRET?.substring(0, 10) + '...');
console.log('');

async function testQuestionRunsEndpoint() {
  try {
    // Step 1: Get OAuth2 token
    console.log('📡 Step 1: Getting OAuth2 token...');
    const authResponse = await fetch('https://api.habu.com/v1/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`
      },
      body: 'grant_type=client_credentials'
    });

    if (!authResponse.ok) {
      const errorText = await authResponse.text();
      console.log('❌ OAuth2 failed:', authResponse.status, errorText);
      return;
    }

    const tokenData = await authResponse.json();
    const accessToken = tokenData.access_token;
    console.log('✅ OAuth2 token obtained!');
    console.log('');

    // Step 2: Get cleanrooms to find the UUID for CR-045487
    console.log('📡 Step 2: Finding cleanroom UUID...');
    const cleanroomsResponse = await fetch('https://api.habu.com/v1/cleanrooms', {
      headers: { 'Authorization': `Bearer ${accessToken}` }
    });

    if (!cleanroomsResponse.ok) {
      console.log('❌ Failed to get cleanrooms:', cleanroomsResponse.status);
      return;
    }

    const cleanroomsData = await cleanroomsResponse.json();
    const targetCleanroom = cleanroomsData.find(cr => cr.displayId === TARGET_CLEANROOM_DISPLAY_ID);
    
    if (!targetCleanroom) {
      console.log('❌ Could not find cleanroom with Display ID:', TARGET_CLEANROOM_DISPLAY_ID);
      console.log('Available cleanrooms:', cleanroomsData.map(cr => ({displayId: cr.displayId, name: cr.name})));
      return;
    }

    console.log('✅ Found cleanroom UUID:', targetCleanroom.id);
    console.log('   Name:', targetCleanroom.name);
    console.log('');

    // Step 3: Test various question runs endpoints
    const endpoints = [
      `/cleanrooms/${targetCleanroom.id}/question-runs`,
      `/cleanrooms/${TARGET_CLEANROOM_DISPLAY_ID}/question-runs`,
      `/cleanroom-question-runs?cleanroomId=${targetCleanroom.id}`,
      `/cleanroom-question-runs?cleanroomId=${TARGET_CLEANROOM_DISPLAY_ID}`,
      `/question-runs?cleanroomId=${targetCleanroom.id}`,
      `/question-runs?cleanroomId=${TARGET_CLEANROOM_DISPLAY_ID}`
    ];

    for (const endpoint of endpoints) {
      console.log(`🔍 Testing endpoint: ${endpoint}`);
      
      try {
        const response = await fetch(`https://api.habu.com/v1${endpoint}`, {
          headers: { 'Authorization': `Bearer ${accessToken}` }
        });

        console.log(`   Status: ${response.status} ${response.statusText}`);
        
        if (response.ok) {
          const data = await response.json();
          console.log(`   ✅ SUCCESS! Found ${data.length || Object.keys(data).length} items`);
          if (Array.isArray(data) && data.length > 0) {
            console.log(`   Sample run: ${data[0].id || 'unknown'} - ${data[0].status || 'unknown'}`);
          } else if (data.runs && data.runs.length > 0) {
            console.log(`   Sample run: ${data.runs[0].id || 'unknown'} - ${data.runs[0].status || 'unknown'}`);
          }
        } else {
          const errorText = await response.text();
          console.log(`   ❌ Error: ${errorText}`);
        }
      } catch (error) {
        console.log(`   ❌ Request failed: ${error.message}`);
      }
      console.log('');
    }

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testQuestionRunsEndpoint();