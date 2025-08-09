import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3001;

// Configure CORS
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || '*'
}));

app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'mcp-dashboard-backend'
  });
});

// STATUS.json endpoint - read from local file
app.get('/api/status', async (req, res) => {
  try {
    const statusPath = path.join(__dirname, '..', 'STATUS.json');
    
    if (!fs.existsSync(statusPath)) {
      throw new Error(`STATUS.json not found at ${statusPath}`);
    }
    
    const statusData = JSON.parse(fs.readFileSync(statusPath, 'utf8'));
    
    res.json({
      ...statusData,
      _api: {
        source: 'Local File',
        fetchedAt: new Date().toISOString(),
        filePath: statusPath
      }
    });
  } catch (error) {
    console.error('Error reading STATUS.json:', error);
    res.status(500).json({
      error: 'Failed to read STATUS.json',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
});

app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});