# 🚀 Manual Setup Guide: MCP Server Dashboard

## 📋 Overview
This guide will help you manually set up a production-ready React dashboard that consumes STATUS.json from your GitHub repository, using Railway for the backend API and Vercel for the frontend.

## 🎯 Architecture
```
GitHub STATUS.json → Railway API Backend → Vercel React Frontend
```

---

## 🔧 Part 1: Backend Setup (Railway)

### Step 1: Create Railway Project
1. Go to [railway.app](https://railway.app) and sign in
2. Click "New Project"
3. Select "Empty Project"
4. Name it: `mcp-server-dashboard`

### Step 2: Create Backend Service
1. In your new project, click "+ New Service"
2. Select "GitHub Repo"
3. Connect to your repository: `bakescakes/mcp-server-habu`
4. **Important**: Set the Root Directory to `dashboard/backend`
5. Name the service: `dashboard-backend`

### Step 3: Configure Backend Environment
1. Go to your backend service settings
2. Under "Settings" → "Environment", add these variables:
   ```
   NODE_ENV=production
   ALLOWED_ORIGINS=https://*.vercel.app,https://*.railway.app
   ```

### Step 4: Backend Code Structure
Create this folder structure in your repository:
```
dashboard/
├── backend/
│   ├── package.json
│   ├── src/
│   │   └── index.ts
│   ├── STATUS.json (copy from root)
│   └── tsconfig.json
└── frontend/
    └── (React app files)
```

### Step 5: Backend package.json
```json
{
  "name": "mcp-dashboard-backend",
  "version": "1.0.0",
  "type": "module",
  "main": "dist/index.js",
  "scripts": {
    "build": "tsc",
    "start": "node dist/index.js",
    "dev": "tsx watch src/index.ts"
  },
  "dependencies": {
    "express": "^5.1.0",
    "cors": "^2.8.5",
    "dotenv": "^17.2.1"
  },
  "devDependencies": {
    "@types/express": "^5.0.3",
    "@types/cors": "^2.8.19",
    "@types/node": "^24.2.0",
    "typescript": "^5.9.2",
    "tsx": "^4.20.3"
  }
}
```

### Step 6: Backend src/index.ts
```typescript
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
        fetchedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error reading STATUS.json:', error);
    res.status(500).json({
      error: 'Failed to read STATUS.json',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
```

### Step 7: Backend tsconfig.json
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "node",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### Step 8: Copy STATUS.json
1. Copy your `STATUS.json` file from the repository root to `dashboard/backend/STATUS.json`
2. This ensures the backend can read it locally without GitHub API calls

### Step 9: Deploy Backend
1. Commit all backend changes to your repository
2. Push to GitHub
3. Railway should automatically deploy your backend
4. Note your backend URL: `https://your-service-name.up.railway.app`

---

## 🎨 Part 2: Frontend Setup (Vercel)

### Step 1: Create React App Structure
```
dashboard/frontend/
├── package.json
├── vite.config.ts
├── index.html
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── components/
│   │   ├── StatusDashboard.tsx
│   │   └── MetricCard.tsx
│   └── styles/
│       └── index.css
└── public/
    └── vite.svg
```

### Step 2: Frontend package.json
```json
{
  "name": "mcp-dashboard-frontend",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "@types/react": "^18.3.3",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.3.1",
    "autoprefixer": "^10.4.20",
    "postcss": "^8.4.41",
    "tailwindcss": "^3.4.10",
    "typescript": "^5.5.3",
    "vite": "^5.4.1"
  }
}
```

### Step 3: Configure Vite (vite.config.ts)
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist'
  }
})
```

### Step 4: Main App Component (src/App.tsx)
```typescript
import React from 'react';
import StatusDashboard from './components/StatusDashboard';
import './styles/index.css';

function App() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <StatusDashboard />
    </div>
  );
}

export default App;
```

### Step 5: Status Dashboard Component (src/components/StatusDashboard.tsx)
```typescript
import React, { useState, useEffect } from 'react';
import MetricCard from './MetricCard';

interface StatusData {
  project: {
    name: string;
    description: string;
    repository: string;
  };
  lastUpdated: string;
  implementation: {
    totalTools: number;
    completedTools: number;
    inProgressTools: number;
    plannedTools: number;
  };
  _api?: {
    source: string;
    fetchedAt: string;
  };
}

const StatusDashboard: React.FC = () => {
  const [data, setData] = useState<StatusData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Replace with your Railway backend URL
  const API_URL = 'https://dashboard-backend-v2-production.up.railway.app/api/status';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
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
    // Refresh every 30 seconds
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-red-400 text-xl mb-4">Error loading dashboard</div>
          <div className="text-gray-400">{error}</div>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const completionPercentage = Math.round(
    (data.implementation.completedTools / data.implementation.totalTools) * 100
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-2">{data.project.name}</h1>
        <p className="text-gray-400 text-lg">{data.project.description}</p>
        <div className="flex items-center gap-4 mt-4 text-sm text-gray-500">
          <span>Last Updated: {new Date(data.lastUpdated).toLocaleDateString()}</span>
          {data._api && <span>Source: {data._api.source}</span>}
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Tools"
          value={data.implementation.totalTools}
          color="blue"
        />
        <MetricCard
          title="Completed"
          value={data.implementation.completedTools}
          color="green"
        />
        <MetricCard
          title="In Progress"
          value={data.implementation.inProgressTools}
          color="yellow"
        />
        <MetricCard
          title="Completion"
          value={`${completionPercentage}%`}
          color="purple"
        />
      </div>

      <div className="mt-8 bg-gray-800 rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Progress Overview</h2>
        <div className="w-full bg-gray-700 rounded-full h-4">
          <div
            className="bg-green-500 h-4 rounded-full transition-all duration-500"
            style={{ width: `${completionPercentage}%` }}
          ></div>
        </div>
        <div className="mt-4 text-gray-400">
          {data.implementation.completedTools} of {data.implementation.totalTools} tools completed
        </div>
      </div>
    </div>
  );
};

export default StatusDashboard;
```

### Step 6: Metric Card Component (src/components/MetricCard.tsx)
```typescript
import React from 'react';

interface MetricCardProps {
  title: string;
  value: string | number;
  color: 'blue' | 'green' | 'yellow' | 'purple';
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, color }) => {
  const colorClasses = {
    blue: 'border-blue-500 bg-blue-500/10',
    green: 'border-green-500 bg-green-500/10',
    yellow: 'border-yellow-500 bg-yellow-500/10',
    purple: 'border-purple-500 bg-purple-500/10'
  };

  return (
    <div className={`border-2 rounded-lg p-6 ${colorClasses[color]}`}>
      <h3 className="text-gray-400 text-sm font-medium uppercase tracking-wide">
        {title}
      </h3>
      <div className="text-3xl font-bold mt-2">{value}</div>
    </div>
  );
};

export default MetricCard;
```

### Step 7: Setup Tailwind CSS

Create `tailwind.config.js`:
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

Create `postcss.config.js`:
```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

Update `src/styles/index.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
```

### Step 8: Deploy to Vercel
1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "New Project"
3. Import your GitHub repository
4. **Important**: Set Root Directory to `dashboard/frontend`
5. Vercel will auto-detect Vite framework
6. Deploy!

---

## 🔗 Part 3: Connect Everything

### Step 1: Update Frontend API URL
In your `StatusDashboard.tsx`, replace the API_URL with your actual Railway backend URL:
```typescript
const API_URL = 'https://YOUR-RAILWAY-SERVICE.up.railway.app/api/status';
```

### Step 2: Update CORS Settings
In your Railway backend environment variables, add your Vercel frontend URL:
```
ALLOWED_ORIGINS=https://YOUR-VERCEL-APP.vercel.app,https://*.vercel.app
```

### Step 3: Test the Connection
1. Visit your Vercel frontend URL
2. It should display your MCP server status
3. Data flows: GitHub STATUS.json → Railway reads local file → Vercel displays data

---

## ✅ Verification Steps

1. **Backend Health Check**: Visit `https://your-railway-service.up.railway.app/health`
2. **API Endpoint**: Visit `https://your-railway-service.up.railway.app/api/status`
3. **Frontend Dashboard**: Visit your Vercel URL and see live data

---

## 🎯 Success Criteria
- ✅ Railway backend serves STATUS.json data
- ✅ Vercel frontend displays professional dashboard
- ✅ No hardcoded data - everything comes from GitHub
- ✅ Auto-refresh every 30 seconds
- ✅ Production-ready with proper error handling

---

## 🚨 Troubleshooting

### Backend Issues
- Ensure `STATUS.json` is copied to `dashboard/backend/STATUS.json`
- Check Railway logs for TypeScript compilation errors
- Verify environment variables are set correctly

### Frontend Issues
- Check browser console for CORS errors
- Verify the API URL points to your Railway backend
- Ensure Tailwind CSS is configured properly

### CORS Issues
- Add your frontend domain to Railway's `ALLOWED_ORIGINS` environment variable
- Include both specific domain and wildcard patterns

---

This manual setup bypasses all the automation issues and gives you full control over each deployment step. Each service can be deployed and debugged independently.