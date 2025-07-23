#!/usr/bin/env node

// Test the credential management functionality
// This script tests the current credential checking and listing capabilities

const { HabuAuthenticator, createAuthConfig } = require('./mcp-habu-runner/dist/auth.js');

const CLIENT_ID = process.env.HABU_CLIENT_ID || 'oTSkZnax86l8jfhzqillOBQk5MJ7zojh';
const CLIENT_SECRET = process.env.HABU_CLIENT_SECRET || 'bGzWYlAxXYPrSL8tsGQOP7ifCjr8eec1fiN-Jo_HpKPSUxeFSxfjIHq032c08SKC';

async function testCredentialManagement() {
    console.log('🧪 Testing Credential Management Functionality\n');

    try {
        // Initialize authenticator
        const authConfig = createAuthConfig('oauth_client_credentials', CLIENT_ID, CLIENT_SECRET);
        const authenticator = new HabuAuthenticator(authConfig);
        const client = await authenticator.getAuthenticatedClient();

        console.log('✅ Authentication successful\n');

        // Test 1: List all organization credentials
        console.log('📋 Test 1: Listing all organization credentials...');
        const allCredentials = await client.get('/organization-credentials');
        console.log(`Found ${allCredentials.data.length} total credentials`);
        
        allCredentials.data.forEach((cred, index) => {
            console.log(`${index + 1}. "${cred.name}"`);
            console.log(`   - ID: ${cred.id}`);
            console.log(`   - Source: ${cred.credentialSourceName || 'Unknown'}`);
            console.log(`   - Source ID: ${cred.credentialSourceId || 'Unknown'}`);
            console.log(`   - Managed: ${cred.managedCredential || false}`);
            console.log(`   - Status: ${cred.status || 'Unknown'}`);
            console.log('');
        });

        // Test 2: Filter AWS credentials specifically
        console.log('🔍 Test 2: Filtering AWS IAM User Credentials...');
        const awsCredentials = allCredentials.data.filter(cred => 
            cred.credentialSourceName === 'AWS IAM User Credentials' ||
            cred.credentialSourceId === '82b512e0-f7bd-4266-9d99-9d58899488be'
        );
        
        console.log(`Found ${awsCredentials.length} AWS credentials`);
        awsCredentials.forEach((cred, index) => {
            console.log(`${index + 1}. "${cred.name}"`);
            console.log(`   - ID: ${cred.id}`);
            console.log(`   - Source: ${cred.credentialSourceName}`);
            console.log(`   - Source ID: ${cred.credentialSourceId}`);
            console.log('');
        });

        // Test 3: Get credential sources to understand available types
        console.log('📊 Test 3: Available credential sources...');
        const credentialSources = await client.get('/credential-sources');
        console.log(`Found ${credentialSources.data.length} credential source types`);
        
        credentialSources.data.forEach((source, index) => {
            console.log(`${index + 1}. "${source.name}"`);
            console.log(`   - ID: ${source.id}`);
            console.log(`   - Display Name: ${source.displayName || 'N/A'}`);
            console.log('');
        });

        // Test 4: Check for duplicate detection scenarios
        console.log('🔍 Test 4: Analyzing potential duplicates...');
        const credentialNames = allCredentials.data.map(cred => cred.name.toLowerCase());
        const duplicateNames = credentialNames.filter((name, index) => 
            credentialNames.indexOf(name) !== index
        );
        
        if (duplicateNames.length > 0) {
            console.log(`⚠️  Found potential duplicate names: ${[...new Set(duplicateNames)].join(', ')}`);
        } else {
            console.log('✅ No duplicate credential names detected');
        }

        console.log('\n🎉 Credential management testing completed successfully!');

    } catch (error) {
        console.error('❌ Error testing credential management:', error.response?.data || error.message);
    }
}

// Run the test
testCredentialManagement();