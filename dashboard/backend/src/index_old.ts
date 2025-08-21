import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';

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

// STATUS.json endpoint - read from local file
app.get('/api/status', async (req, res) => {
  try {
    const statusPath = path.join(__dirname, '..', 'STATUS.json');
    console.log('Reading STATUS.json from local file...', statusPath);
    
    if (!fs.existsSync(statusPath)) {
      throw new Error(`STATUS.json file not found at ${statusPath}`);
    }
    
    const statusData = JSON.parse(fs.readFileSync(statusPath, 'utf8'));
    
    // Add API metadata
    const enrichedData = {
      ...statusData,
      _api: {
        source: 'Local File',
        fetchedAt: new Date().toISOString(),
        filePath: statusPath
      }
    };
    
    console.log('✅ STATUS.json loaded successfully from local file');
    res.json(enrichedData);
    
  } catch (error) {
    console.error('❌ Error reading STATUS.json:', error);
    res.status(500).json({
      error: 'Failed to read STATUS.json',
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