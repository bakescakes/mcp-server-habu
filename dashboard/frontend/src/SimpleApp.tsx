import React, { useState, useEffect } from 'react';

interface StatusData {
  project: {
    name: string;
    status: string;
    phase: string;
  };
  categories?: Record<string, number>;
  tools?: {
    total: number;
  };
  _api?: {
    source: string;
    fetchedAt: string;
  };
}

function SimpleApp() {
  const [data, setData] = useState<StatusData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_URL = 'https://mcp-server-habu-production.up.railway.app/api/status';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) {
          throw new Error(`API Error: ${response.status}`);
        }
        const result = await response.json();
        setData(result);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', fontFamily: 'Arial, sans-serif' }}>
        <h1>Loading MCP Server Dashboard...</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', fontFamily: 'Arial, sans-serif' }}>
        <h1 style={{ color: 'red' }}>Error Loading Dashboard</h1>
        <p>{error}</p>
        <p>API URL: {API_URL}</p>
      </div>
    );
  }

  if (!data) return null;

  const categoryTotals = data.categories ? Object.values(data.categories).reduce((a, b) => a + b, 0) : 0;

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f8fafc', 
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' 
    }}>
      {/* Header */}
      <header style={{ 
        backgroundColor: 'white', 
        borderBottom: '1px solid #e2e8f0', 
        padding: '24px 0' 
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
          <h1 style={{ 
            fontSize: '36px', 
            fontWeight: 'bold', 
            color: '#1a202c', 
            margin: '0 0 8px 0' 
          }}>
            {data.project.name}
          </h1>
          <p style={{ 
            fontSize: '18px', 
            color: '#4a5568', 
            margin: '0' 
          }}>
            Status: {data.project.status} • Phase: {data.project.phase}
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px' }}>
        
        {/* Stats Cards */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '24px',
          marginBottom: '40px'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '32px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e2e8f0'
          }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#4a5568', margin: '0 0 8px 0' }}>
              Total Tools
            </h3>
            <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#2d3748' }}>
              {categoryTotals || data.tools?.total || 'N/A'}
            </div>
          </div>

          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '32px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e2e8f0'
          }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#4a5568', margin: '0 0 8px 0' }}>
              Project Status
            </h3>
            <div style={{ fontSize: '24px', fontWeight: '600', color: '#38a169' }}>
              {data.project.status}
            </div>
            <div style={{ fontSize: '16px', color: '#718096', marginTop: '8px' }}>
              {data.project.phase}
            </div>
          </div>
        </div>

        {/* Categories */}
        {data.categories && (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '32px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e2e8f0'
          }}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#2d3748', margin: '0 0 24px 0' }}>
              Tool Categories
            </h2>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
              gap: '16px'
            }}>
              {Object.entries(data.categories).map(([category, count]) => (
                <div key={category} style={{
                  padding: '20px',
                  backgroundColor: '#f7fafc',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0'
                }}>
                  <div style={{ fontSize: '16px', fontWeight: '600', color: '#4a5568', textTransform: 'capitalize' }}>
                    {category.replace(/([A-Z])/g, ' $1').trim()}
                  </div>
                  <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#2d3748', marginTop: '8px' }}>
                    {count}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* API Info */}
        {data._api && (
          <div style={{ 
            marginTop: '40px', 
            padding: '20px', 
            backgroundColor: '#edf2f7', 
            borderRadius: '8px',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{ fontSize: '14px', color: '#4a5568' }}>
              <strong>Data Source:</strong> {data._api.source} | 
              <strong> Last Updated:</strong> {new Date(data._api.fetchedAt).toLocaleString()}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default SimpleApp;