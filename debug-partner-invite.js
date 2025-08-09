// Debug script to test partner invitation API calls
const { authenticator } = require('./mcp-habu-runner/dist/index.js');

async function debugPartnerInvite() {
  const cleanroomId = '1f901228-c59d-4747-a851-7e178f40ed6b'; // CR-045487

  try {
    console.log('1. Testing /cleanrooms list...');
    const allCleanrooms = await makeAPICall('/cleanrooms');
    const foundCleanroom = allCleanrooms.find(cr => cr.id === cleanroomId);
    console.log('Found in list:', foundCleanroom ? 'YES' : 'NO');
    if (foundCleanroom) {
      console.log('Display ID:', foundCleanroom.displayId);
      console.log('Name:', foundCleanroom.name);
    }

    console.log('\n2. Testing direct cleanroom access...');
    const directCleanroom = await makeAPICall(`/cleanrooms/${cleanroomId}`);
    console.log('Direct access success:', directCleanroom ? 'YES' : 'NO');
    console.log('Name:', directCleanroom.name);

    console.log('\n3. Testing invitations endpoint...');
    const invitations = await makeAPICall(`/cleanrooms/${cleanroomId}/invitations`);
    console.log('Invitations access success:', Array.isArray(invitations) ? 'YES' : 'NO');
    console.log('Invitations count:', Array.isArray(invitations) ? invitations.length : 0);

    console.log('\n4. Testing partner-invitations endpoint (POST)...');
    const testInvitation = {
      partnerEmail: 'test@example.com',
      message: 'Test invitation',
      role: 'analyst'
    };
    
    try {
      const result = await makeAPICall(`/cleanrooms/${cleanroomId}/partner-invitations`, 'POST', testInvitation);
      console.log('Partner invitation success:', result ? 'YES' : 'NO');
    } catch (postError) {
      console.log('Partner invitation error:', postError.response?.status, postError.response?.data);
    }

  } catch (error) {
    console.error('Debug error:', error.response?.status, error.response?.data);
  }
}

async function makeAPICall(endpoint, method = 'GET', data = null) {
  // This would need the actual makeAPICall implementation
  console.log(`Would call: ${method} ${endpoint}`);
  if (data) console.log('With data:', JSON.stringify(data, null, 2));
  return null; // Placeholder
}

debugPartnerInvite();