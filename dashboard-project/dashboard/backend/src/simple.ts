import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3001;

// CORS configuration
const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000', 'http://localhost:5173', 'https://*.vercel.app'],
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'habu-dashboard-api',
    version: '1.0.0'
  });
});

// STATUS.json endpoint - direct GitHub fetch
app.get('/api/status', async (req, res) => {
  try {
    const STATUS_URL = 'https://raw.githubusercontent.com/bakescakes/mcp-server-habu/main/STATUS.json';
    console.log('Fetching STATUS.json from GitHub...');
    
    const response = await fetch(STATUS_URL);
    
    if (!response.ok) {
      throw new Error(`GitHub fetch failed: ${response.status}`);
    }
    
    const statusData = await response.json();
    
    // Add API metadata
    const enrichedData = {
      ...statusData,
      _api: {
        source: 'GitHub Raw',
        fetchedAt: new Date().toISOString(),
        url: STATUS_URL
      }
    };
    
    console.log('✅ STATUS.json fetched successfully');
    res.json(enrichedData);
    
  } catch (error) {
    console.error('❌ Error fetching STATUS.json:', error);
    res.status(500).json({
      error: 'Failed to fetch STATUS.json',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Habu Dashboard API server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🔗 STATUS API: http://localhost:${PORT}/api/status`);
  console.log(`🕐 Started at: ${new Date().toISOString()}`);
});