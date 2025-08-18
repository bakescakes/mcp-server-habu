// Direct invitation test to bypass verification
const cleanroomId = '1f901228-c59d-4747-a851-7e178f40ed6b'; // CR-045487
const partnerEmail = 'scott.benjamin.baker@gmail.com';

// This would be the direct API call to test:
// POST /cleanrooms/1f901228-c59d-4747-a851-7e178f40ed6b/partners
// {
//   "partnerAdminEmail": "scott.benjamin.baker@gmail.com",
//   "invitationNote": "Demo setup test"
// }

console.log('Testing direct API call:');
console.log(`POST /cleanrooms/${cleanroomId}/partners`);
console.log({
  partnerAdminEmail: partnerEmail,
  invitationNote: "Demo setup test"
});