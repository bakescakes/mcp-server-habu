#!/usr/bin/env node

/**
 * Debug Question Metadata Fetch
 * Test if we can fetch question metadata to analyze partition requirements
 */

require('dotenv').config({ path: './mcp-habu-runner/.env' });

const CLIENT_ID = process.env.HABU_API_KEY_PUBLISHER_SANDBOX || 'oTSkZnax86l8jfhzqillOBQk5MJ7zojh';
const CLIENT_SECRET = process.env.HABU_API_KEY || 'bGzWYlAxXYPrSL8tsGQOP7ifCjr8eec1fiN-Jo_HpKPSUxeFSxfjIHq032c08SKC';

async function getAccessToken() {
  console.log('🔐 Getting OAuth2 token...');
  
  // Use Basic Auth for client credentials (RFC 6749 standard)
  const credentials = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');
  
  const tokenParams = new URLSearchParams({
    grant_type: 'client_credentials'
  });

  const response = await fetch('https://api.habu.com/v1/oauth/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json',
      'Authorization': `Basic ${credentials}`
    },
    body: tokenParams
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Token request failed: ${response.status} ${response.statusText} - ${errorText}`);
  }

  const data = await response.json();
  console.log('✅ OAuth2 token obtained');
  return data.accessToken || data.access_token;
}

async function testQuestionMetadataFetch() {
  try {
    const token = await getAccessToken();
    
    // Test question IDs
    const testQuestions = [
      {
        id: '9a506ecb-4b21-4e48-ba97-916edc43aea0', // CRQ-138037 (reach question - should need @exposures)
        displayId: 'CRQ-138037'
      },
      {
        id: 'c9013f1e-b7f7-4d1d-b352-73324654c554', // CRQ-138033 (attribution - should need @exposures + @conversions)
        displayId: 'CRQ-138033'
      }
    ];
    
    for (const question of testQuestions) {
      console.log(`\n🔍 Testing question ${question.displayId} (${question.id})`);
      
      const response = await fetch(`https://api.habu.com/v1/cleanroom-questions/${question.id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      console.log(`📊 Response status: ${response.status} ${response.statusText}`);
      
      if (response.ok) {
        const metadata = await response.json();
        console.log('✅ Metadata fetch successful');
        console.log('📋 Full metadata structure:');
        console.log(JSON.stringify(metadata, null, 2));
        
        // Try different fields that might contain SQL
        const sqlFields = ['description', 'sql', 'query', 'definition', 'template', 'details'];
        let foundSql = null;
        let sqlFieldName = null;
        
        for (const field of sqlFields) {
          if (metadata[field] && typeof metadata[field] === 'string' && metadata[field].trim().length > 0) {
            foundSql = metadata[field];
            sqlFieldName = field;
            break;
          }
        }
        
        if (foundSql) {
          console.log(`🧠 SQL found in field '${sqlFieldName}' (${foundSql.length} characters)`);
          const sql = foundSql.toLowerCase();
          const hasExposures = sql.includes('@exposures');
          const hasConversions = sql.includes('@conversions');
          const hasPartnerCrm = sql.includes('@partner_crm');
          
          console.log('🧠 SQL Analysis:');
          console.log(`   Contains @exposures: ${hasExposures ? '✅' : '❌'}`);
          console.log(`   Contains @conversions: ${hasConversions ? '✅' : '❌'}`);
          console.log(`   Contains @partner_crm: ${hasPartnerCrm ? '✅' : '❌'}`);
          
          // Test our detection function
          const detectedParams = [];
          if (hasExposures) {
            detectedParams.push('exposures.date_start', 'exposures.date_end');
          }
          if (hasConversions) {
            detectedParams.push('conversions.date_start', 'conversions.date_end');
          }
          if (hasPartnerCrm && !hasExposures) {
            detectedParams.push('exposures.date_start', 'exposures.date_end');
          }
          
          console.log(`📋 Detected partition parameters: ${detectedParams.length > 0 ? detectedParams.join(', ') : 'None'}`);
          
          // Show SQL snippet for verification
          if (foundSql.length > 200) {
            console.log(`📄 SQL snippet: ${foundSql.substring(0, 200)}...`);
          } else {
            console.log(`📄 Full SQL: ${foundSql}`);
          }
          
        } else {
          console.log('❌ No SQL field found in metadata');
        }
      } else {
        const errorText = await response.text();
        console.log(`❌ Metadata fetch failed: ${errorText}`);
      }
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testQuestionMetadataFetch();