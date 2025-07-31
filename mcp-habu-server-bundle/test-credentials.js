#!/usr/bin/env node

/**
 * Habu API Credential Tester
 * 
 * This utility helps you quickly test different authentication methods
 * with the Habu API. Update the credentials below and run to test.
 */

import { HabuAuthenticator, createAuthConfig } from './dist/auth.js';

// Add your credentials here to test
const TEST_CREDENTIALS = [
  // Bearer tokens
  { method: 'bearer', creds: ['bGzWYlAxXYPrSL8tsGQOP7ifCjr8eec1fiN-Jo_HpKPSUxeFSxfjIHq032c08SKC'] },
  { method: 'bearer', creds: ['oTSkZnax86l8jfhzqillOBQk5MJ7zojh'] },
  
  // API Keys
  { method: 'apikey', creds: ['bGzWYlAxXYPrSL8tsGQOP7ifCjr8eec1fiN-Jo_HpKPSUxeFSxfjIHq032c08SKC'] },
  { method: 'apikey', creds: ['oTSkZnax86l8jfhzqillOBQk5MJ7zojh'] },
  
  // Basic Auth (treating keys as username:password)
  { method: 'basic', creds: ['bGzWYlAxXYPrSL8tsGQOP7ifCjr8eec1fiN-Jo_HpKPSUxeFSxfjIHq032c08SKC', 'oTSkZnax86l8jfhzqillOBQk5MJ7zojh'] },
  { method: 'basic', creds: ['oTSkZnax86l8jfhzqillOBQk5MJ7zojh', 'bGzWYlAxXYPrSL8tsGQOP7ifCjr8eec1fiN-Jo_HpKPSUxeFSxfjIHq032c08SKC'] },
  
  // OAuth Password Grant
  { method: 'oauth_password', creds: ['bGzWYlAxXYPrSL8tsGQOP7ifCjr8eec1fiN-Jo_HpKPSUxeFSxfjIHq032c08SKC', 'oTSkZnax86l8jfhzqillOBQk5MJ7zojh'] },
  { method: 'oauth_password', creds: ['oTSkZnax86l8jfhzqillOBQk5MJ7zojh', 'bGzWYlAxXYPrSL8tsGQOP7ifCjr8eec1fiN-Jo_HpKPSUxeFSxfjIHq032c08SKC'] },
  
  // OAuth Client Credentials
  { method: 'oauth_client_credentials', creds: ['bGzWYlAxXYPrSL8tsGQOP7ifCjr8eec1fiN-Jo_HpKPSUxeFSxfjIHq032c08SKC', 'oTSkZnax86l8jfhzqillOBQk5MJ7zojh'] },
  { method: 'oauth_client_credentials', creds: ['oTSkZnax86l8jfhzqillOBQk5MJ7zojh', 'bGzWYlAxXYPrSL8tsGQOP7ifCjr8eec1fiN-Jo_HpKPSUxeFSxfjIHq032c08SKC'] },
];

async function testAllCredentials() {
  console.log('🧪 Testing all credential combinations with Habu API...\n');
  
  for (let i = 0; i < TEST_CREDENTIALS.length; i++) {
    const { method, creds } = TEST_CREDENTIALS[i];
    
    try {
      console.log(`\n${i + 1}/${TEST_CREDENTIALS.length} Testing ${method} with credentials:`, 
        creds.map(c => c.substring(0, 8) + '...').join(', '));
      
      const config = createAuthConfig(method, ...creds);
      const authenticator = new HabuAuthenticator(config);
      
      const result = await authenticator.testConnection();
      
      if (result.success) {
        console.log('🎉 SUCCESS! This method works:');
        console.log('   Method:', method);
        console.log('   Credentials:', creds.map(c => c.substring(0, 10) + '...').join(', '));
        console.log('   Cleanrooms found:', result.details?.cleanroomCount);
        console.log('\n✅ Update your .env file with:');
        console.log(`   USE_REAL_API=true`);
        console.log(`   HABU_AUTH_METHOD=${method}`);
        if (method === 'bearer') {
          console.log(`   HABU_API_TOKEN=${creds[0]}`);
        } else if (method === 'apikey') {
          console.log(`   HABU_API_KEY=${creds[0]}`);
        } else if (method === 'basic' || method.includes('oauth')) {
          console.log(`   HABU_USERNAME=${creds[0]}`);
          console.log(`   HABU_PASSWORD=${creds[1]}`);
        }
        
        // Don't test more methods once we find one that works
        return;
      } else {
        console.log('❌ Failed:', result.error);
      }
    } catch (error) {
      console.log('❌ Error:', error.message);
    }
  }
  
  console.log('\n💔 No authentication methods worked.');
  console.log('\n🔍 Next steps:');
  console.log('1. Contact LiveRamp/Habu support for correct authentication method');
  console.log('2. Verify the API keys are activated and have proper permissions');
  console.log('3. Check if your IP address needs to be whitelisted');
  console.log('4. Verify the API endpoint URL is correct');
  console.log('\n📧 Contact information:');
  console.log('   - Habu: platform@habu.com');
  console.log('   - LiveRamp: Your account representative');
}

// Allow adding custom credentials via command line
if (process.argv.length > 2) {
  const customMethod = process.argv[2];
  const customCreds = process.argv.slice(3);
  
  if (customCreds.length > 0) {
    console.log(`🧪 Testing custom credentials: ${customMethod} with ${customCreds.length} parameters\n`);
    
    try {
      const config = createAuthConfig(customMethod, ...customCreds);
      const authenticator = new HabuAuthenticator(config);
      
      const result = await authenticator.testConnection();
      
      if (result.success) {
        console.log('🎉 SUCCESS with custom credentials!');
        console.log('Details:', result.details);
      } else {
        console.log('❌ Failed with custom credentials:', result.error);
      }
    } catch (error) {
      console.log('❌ Error with custom credentials:', error.message);
    }
  } else {
    console.log('Usage: node test-credentials.js [method] [credential1] [credential2]');
    console.log('Example: node test-credentials.js bearer YOUR_TOKEN_HERE');
  }
} else {
  // Run all tests
  testAllCredentials().catch(console.error);
}