function Debug() {
  const apiUrl = import.meta.env.VITE_API_URL || 'not set';
  
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Debug Dashboard</h1>
      <p><strong>API URL:</strong> {apiUrl}</p>
      <p><strong>Environment:</strong> {import.meta.env.MODE}</p>
      <p><strong>Status:</strong> App is loading correctly!</p>
      
      <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f0f0f0', borderRadius: '5px' }}>
        <h3>Environment Variables:</h3>
        <pre>{JSON.stringify(import.meta.env, null, 2)}</pre>
      </div>
    </div>
  );
}

export default Debug;