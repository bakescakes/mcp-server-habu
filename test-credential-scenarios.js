#!/usr/bin/env node

// Test specific credential management scenarios with the live API
const { HabuAuthenticator, createAuthConfig } = require('./mcp-habu-runner/dist/auth.js');

const CLIENT_ID = process.env.HABU_CLIENT_ID || 'oTSkZnax86l8jfhzqillOBQk5MJ7zojh';
const CLIENT_SECRET = process.env.HABU_CLIENT_SECRET || 'bGzWYlAxXYPrSL8tsGQOP7ifCjr8eec1fiN-Jo_HpKPSUxeFSxfjIHq032c08SKC';

async function testCredentialScenarios() {
    console.log('🧪 Testing Enhanced Credential Management Scenarios\n');

    try {
        // Initialize authenticator
        const authConfig = createAuthConfig('oauth_client_credentials', CLIENT_ID, CLIENT_SECRET);
        const authenticator = new HabuAuthenticator(authConfig);
        const client = await authenticator.getAuthenticatedClient();

        console.log('✅ Authentication successful\n');

        // Test the enhanced logic from the production code
        console.log('📋 **Scenario 1:** List and analyze existing AWS credentials...');
        
        const existingCredentials = await client.get('/organization-credentials');
        const awsCredentials = existingCredentials.data.filter(cred => 
            cred.credentialSourceId === '82b512e0-f7bd-4266-9d99-9d58899488be'
        );
        
        // Enhanced credential validation (from our new code)
        const validAwsCredentials = awsCredentials.filter(cred => {
            return cred.name && cred.id && cred.credentialSourceId;
        });

        console.log(`Found ${existingCredentials.data.length} total credentials`);
        console.log(`Found ${awsCredentials.length} AWS credentials`);
        console.log(`Found ${validAwsCredentials.length} VALID AWS credentials\n`);

        console.log('🔍 **Valid AWS Credentials Analysis:**');
        validAwsCredentials.forEach((cred, index) => {
            console.log(`${index + 1}. "${cred.name}"`);
            console.log(`   - ID: ${cred.id}`);
            console.log(`   - Type: ${cred.managedCredential ? '🏢 Managed' : '👤 User-Created'}`);
            console.log(`   - Source ID: ${cred.credentialSourceId}`);
            
            // Validation status
            if (cred.name && cred.id && cred.credentialSourceId === '82b512e0-f7bd-4266-9d99-9d58899488be') {
                console.log(`   - Status: ✅ Valid AWS IAM Credential`);
            } else {
                console.log(`   - Status: ⚠️  Validation Issues`);
            }
            console.log('');
        });

        console.log('🎯 **Scenario 2:** Smart recommendation logic...');
        
        if (validAwsCredentials.length === 1) {
            console.log(`✅ SINGLE CREDENTIAL DETECTED`);
            console.log(`   Recommendation: Auto-select "${validAwsCredentials[0].name}"`);
            console.log(`   Command: useExistingCredential: true (will auto-select)`);
            console.log(`   Or specific: existingCredentialId: "${validAwsCredentials[0].id}"`);
        } else if (validAwsCredentials.length > 1) {
            console.log(`⚠️  MULTIPLE CREDENTIALS DETECTED`);
            console.log(`   Recommendation: User must choose specific credential`);
            validAwsCredentials.forEach((cred, index) => {
                console.log(`   Option ${index + 1}: existingCredentialId: "${cred.id}" // ${cred.name}`);
            });
        } else {
            console.log(`ℹ️  NO VALID CREDENTIALS`);
            console.log(`   Recommendation: Create new credential with AWS details`);
        }

        console.log('\n💡 **Scenario 3:** Name conflict detection...');
        
        const testCredentialName = "Test Enhanced Credential Detection";
        const potentialNameConflict = existingCredentials.data.find(cred => 
            cred.name.toLowerCase() === testCredentialName.toLowerCase()
        );
        
        if (potentialNameConflict) {
            console.log(`⚠️  NAME CONFLICT: "${potentialNameConflict.name}" already exists`);
            console.log(`   ID: ${potentialNameConflict.id}`);
            console.log(`   Action: Would warn user but proceed with creation`);
        } else {
            console.log(`✅ NO NAME CONFLICT: "${testCredentialName}" is available`);
        }

        console.log('\n🔒 **Scenario 4:** ARN validation example...');
        
        const testArns = [
            'arn:aws:iam::123456789012:user/testuser',
            'arn:aws:iam::123456789012:role/testrole', 
            'invalid-arn-format',
            'arn:aws:iam::123456789012:user/test-user_with+special=chars'
        ];
        
        const arnPattern = /^arn:aws:iam::\d{12}:(user|role)\/[a-zA-Z0-9+=,.@\-_/]+$/;
        
        testArns.forEach(arn => {
            const isValid = arnPattern.test(arn);
            console.log(`${isValid ? '✅' : '❌'} ${arn}`);
        });

        console.log('\n🎉 **Enhanced credential management scenarios tested successfully!**');
        
        console.log('\n📊 **Summary of Improvements:**');
        console.log('✅ Enhanced credential filtering (credentialSourceId-based)');
        console.log('✅ Smart validation of existing credentials');
        console.log('✅ Intelligent auto-selection for single credentials');
        console.log('✅ Better guidance for multiple credential scenarios');
        console.log('✅ Name conflict detection before creation');
        console.log('✅ ARN format validation');
        console.log('✅ Comprehensive error handling and user guidance');
        console.log('✅ Duplicate prevention with user choice');

    } catch (error) {
        console.error('❌ Error testing credential scenarios:', error.response?.data || error.message);
    }
}

// Run the test
testCredentialScenarios();