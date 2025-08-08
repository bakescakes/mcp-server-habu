import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// ES Module __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// GitHub repository configuration
const GITHUB_REPO = process.env.GITHUB_REPO || 'bakescakes/mcp-server-habu';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const STATUS_JSON_URL = `https://raw.githubusercontent.com/${GITHUB_REPO}/main/STATUS.json`;

// CORS configuration for production
const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000', 'http://localhost:5173'],
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

// STATUS.json endpoint - supports both local file and GitHub API
app.get('/api/status', async (req, res) => {
  try {
    // Try local file first (for same-repo deployment)
    const localPath = path.join(__dirname, '../../../STATUS.json');
    console.log(`Checking for local STATUS.json at: ${localPath}`);
    
    if (fs.existsSync(localPath)) {
      console.log('Using local STATUS.json file');
      const statusData = JSON.parse(fs.readFileSync(localPath, 'utf8'));
      
      const enrichedData = {
        ...statusData,
        _api: {
          source: 'Local File',
          path: 'STATUS.json',
          fetchedAt: new Date().toISOString(),
          cached: false
        }
      };
      
      console.log('Successfully loaded local STATUS.json');
      return res.json(enrichedData);
    }
    
    // Fallback to GitHub API (for separate deployment)
    console.log(`Fetching STATUS.json from GitHub: ${STATUS_JSON_URL}`);
    
    const headers: HeadersInit = {
      'User-Agent': 'Habu-Dashboard-API/1.0.0',
      'Accept': 'application/vnd.github.v3.raw',
    };

    if (GITHUB_TOKEN) {
      headers['Authorization'] = `token ${GITHUB_TOKEN}`;
    }

    const response = await fetch(STATUS_JSON_URL, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      console.error(`GitHub API error: ${response.status} ${response.statusText}`);
      return res.status(response.status).json({
        error: 'Failed to fetch STATUS.json from GitHub',
        status: response.status,
        statusText: response.statusText,
        timestamp: new Date().toISOString()
      });
    }

    const statusData = await response.json();
    
    const enrichedData = {
      ...statusData,
      _api: {
        source: 'GitHub Raw API',
        url: STATUS_JSON_URL,
        fetchedAt: new Date().toISOString(),
        cached: false
      }
    };
    
    console.log('Successfully fetched STATUS.json from GitHub');
    res.json(enrichedData);
    
  } catch (error) {
    console.error('Error loading STATUS.json:', error);
    res.status(500).json({
      error: 'Internal server error while loading status data',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
});

// Get repository metadata
app.get('/api/repo', async (req, res) => {
  try {
    const repoUrl = `https://api.github.com/repos/${GITHUB_REPO}`;
    console.log(`Fetching repo metadata from: ${repoUrl}`);
    
    const headers: HeadersInit = {
      'User-Agent': 'Habu-Dashboard-API/1.0.0',
      'Accept': 'application/vnd.github.v3+json',
    };

    if (GITHUB_TOKEN) {
      headers['Authorization'] = `token ${GITHUB_TOKEN}`;
    }

    const response = await fetch(repoUrl, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      console.error(`GitHub API error: ${response.status} ${response.statusText}`);
      return res.status(response.status).json({
        error: 'Failed to fetch repository metadata',
        status: response.status,
        statusText: response.statusText
      });
    }

    const repoData = await response.json();
    
    // Return relevant repository information
    const filteredData = {
      name: repoData.name,
      full_name: repoData.full_name,
      description: repoData.description,
      html_url: repoData.html_url,
      updated_at: repoData.updated_at,
      pushed_at: repoData.pushed_at,
      stargazers_count: repoData.stargazers_count,
      language: repoData.language,
      default_branch: repoData.default_branch,
      _api: {
        fetchedAt: new Date().toISOString()
      }
    };
    
    res.json(filteredData);
    
  } catch (error) {
    console.error('Error fetching repository metadata:', error);
    res.status(500).json({
      error: 'Internal server error while fetching repository data',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Catch-all error handler
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message,
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not found',
    path: req.path,
    method: req.method,
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Habu Dashboard API server running on port ${PORT}`);
  console.log(`📊 STATUS.json URL: ${STATUS_JSON_URL}`);
  console.log(`🔐 GitHub token: ${GITHUB_TOKEN ? 'configured' : 'not configured'}`);
  console.log(`🌐 CORS origins: ${corsOptions.origin}`);
  console.log(`🕐 Started at: ${new Date().toISOString()}`);
});