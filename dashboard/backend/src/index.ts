import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3001;

// Configure CORS - be more explicit about allowed origins
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',').map(o => o.trim()) || ['*'];
console.log('CORS allowed origins:', allowedOrigins);

app.use(cors({
  origin: allowedOrigins.includes('*') ? true : allowedOrigins,
  credentials: false,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
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

// CORS test endpoint
app.get('/api/cors-test', (req, res) => {
  res.json({
    message: 'CORS is working',
    origin: req.headers.origin || 'No origin header',
    timestamp: new Date().toISOString(),
    allowedOrigins: process.env.ALLOWED_ORIGINS?.split(',') || ['*']
  });
});

// STATUS.json endpoint - fetch from GitHub
app.get('/api/status', async (req, res) => {
  try {
    // GitHub configuration
    const GITHUB_OWNER = 'bakescakes';
    const GITHUB_REPO = 'mcp-server-habu';
    const GITHUB_FILE_PATH = 'STATUS.json';
    
    // Construct GitHub API URL
    const githubUrl = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${GITHUB_FILE_PATH}`;
    
    // Prepare headers for GitHub API
    const headers: Record<string, string> = {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'MCP-Server-Dashboard-Backend/1.0'
    };
    
    // Add authentication if GitHub token is available (for private repos)
    if (process.env.GITHUB_TOKEN) {
      headers['Authorization'] = `Bearer ${process.env.GITHUB_TOKEN}`;
    }
    
    console.log(`Fetching STATUS.json from GitHub: ${githubUrl}`);
    console.log(`Using authentication: ${process.env.GITHUB_TOKEN ? 'YES' : 'NO'}`);
    
    // Fetch from GitHub API
    const response = await fetch(githubUrl, { headers });
    
    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
    }
    
    const githubData = await response.json();
    
    // Decode the base64 content
    const statusContent = Buffer.from(githubData.content, 'base64').toString('utf8');
    const statusData = JSON.parse(statusContent);
    
    res.json({
      ...statusData,
      _api: {
        source: 'GitHub API',
        fetchedAt: new Date().toISOString(),
        repository: `${GITHUB_OWNER}/${GITHUB_REPO}`,
        filePath: GITHUB_FILE_PATH,
        githubSha: githubData.sha,
        authenticated: !!process.env.GITHUB_TOKEN
      }
    });
  } catch (error) {
    console.error('Error fetching STATUS.json from GitHub:', error);
    
    // Fallback to local file if GitHub fetch fails
    try {
      console.log('Attempting fallback to local STATUS.json...');
      const statusPath = path.join(__dirname, '..', 'STATUS.json');
      
      if (fs.existsSync(statusPath)) {
        const statusData = JSON.parse(fs.readFileSync(statusPath, 'utf8'));
        res.json({
          ...statusData,
          _api: {
            source: 'Local File (Fallback)',
            fetchedAt: new Date().toISOString(),
            filePath: statusPath,
            fallbackReason: error instanceof Error ? error.message : 'GitHub fetch failed'
          }
        });
        return;
      }
    } catch (fallbackError) {
      console.error('Local fallback also failed:', fallbackError);
    }
    
    res.status(500).json({
      error: 'Failed to fetch STATUS.json',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
      attempted: ['GitHub API', 'Local File Fallback']
    });
  }
});

app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});