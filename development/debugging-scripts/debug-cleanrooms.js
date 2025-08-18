#!/usr/bin/env node

// Debug script to investigate cleanrooms API response

import axios from 'axios';

const CLIENT_ID = process.env.HABU_CLIENT_ID || process.env.HABU_API_KEY_PUBLISHER_SANDBOX || 'oTSkZnax86l8jfhzqillOBQk5MJ7zojh';
const CLIENT_SECRET = process.env.HABU_CLIENT_SECRET || process.env.HABU_API_KEY || 'bGzWYlAxXYPrSL8tsGQOP7ifCjr8eec1fiN-Jo_HpKPSUxeFSxfjIHq032c08SKC';
const API_BASE = 'https://api.habu.com/v1';

async function getAccessToken() {
    console.log('🔐 Getting OAuth token...');
    console.log(`CLIENT_ID: ${CLIENT_ID?.substring(0, 8)}...`);
    console.log(`CLIENT_SECRET: ${CLIENT_SECRET?.substring(0, 8)}...`);
    
    const credentials = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');
    
    try {
        const response = await axios.post(`${API_BASE}/oauth/token`, 
            { grant_type: 'client_credentials' },
            {
                headers: {
                    'Authorization': `Basic ${credentials}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        
        console.log('✅ Token response status:', response.status);
        console.log('✅ Token acquired successfully');
        return response.data.accessToken;
    } catch (error) {
        console.error('❌ Token error:', error.response?.data || error.message);
        throw error;
    }
}

async function debugCleanrooms() {
    try {
        const token = await getAccessToken();
        
        console.log('\n📋 Calling /cleanrooms endpoint...');
        
        const response = await axios.get(`${API_BASE}/cleanrooms`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        console.log('✅ Cleanrooms response status:', response.status);
        console.log('✅ Response headers:', JSON.stringify(response.headers, null, 2));
        console.log('✅ Raw response data:', JSON.stringify(response.data, null, 2));
        console.log('✅ Response type:', typeof response.data);
        console.log('✅ Is array:', Array.isArray(response.data));
        console.log('✅ Length:', response.data?.length || 'N/A');
        
        if (Array.isArray(response.data) && response.data.length > 0) {
            console.log('\n🎉 Found cleanrooms:');
            response.data.forEach((cr, index) => {
                console.log(`${index + 1}. ${cr.name || 'Unnamed'}`);
                console.log(`   ID: ${cr.id}`);
                console.log(`   Status: ${cr.status}`);
                console.log(`   Full object:`, JSON.stringify(cr, null, 2));
            });
        } else {
            console.log('\n⚠️ No cleanrooms returned or empty array');
        }
        
    } catch (error) {
        console.error('❌ Error:', error.response?.data || error.message);
        console.error('❌ Status:', error.response?.status);
        console.error('❌ Headers:', error.response?.headers);
    }
}

debugCleanrooms();