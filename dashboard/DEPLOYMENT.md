# 🚀 Deployment Guide

## Production-Ready React Dashboard for Habu MCP Server

This guide covers deploying the complete dashboard architecture to Railway (API) and Vercel (Frontend).

### Architecture Overview

```
GitHub STATUS.json → Railway API Backend → Vercel React Frontend
```

## 🛤️ Railway API Deployment

### 1. Create Railway Project
1. Go to [Railway.app](https://railway.app)
2. Create new project from GitHub repository
3. Select the `backend` folder as build directory

### 2. Environment Variables (Required)
Set these in Railway dashboard:

```bash
# Required for private GitHub repo access
GITHUB_TOKEN=ghp_your_github_token_here

# Repository configuration
GITHUB_REPO=bakescakes/mcp-server-habu

# CORS configuration (update with your Vercel domain)
ALLOWED_ORIGINS=https://your-app.vercel.app,https://habu-dashboard.vercel.app

# Port (Railway will auto-assign)
PORT=$PORT
```

### 3. Build Configuration
Railway automatically detects Node.js and uses:
- Build Command: `npm run build` (from backend/package.json)
- Start Command: `npm start`
- Auto-deploy: Enabled for main branch

### Expected API Endpoints:
- `https://your-api.railway.app/health` - Health check
- `https://your-api.railway.app/api/status` - STATUS.json proxy
- `https://your-api.railway.app/api/repo` - Repository metadata

## ▲ Vercel Frontend Deployment

### 1. Create Vercel Project
1. Go to [Vercel.com](https://vercel.com)
2. Import GitHub repository
3. Select `frontend` folder as root directory

### 2. Environment Variables (Required)
Set in Vercel dashboard:

```bash
# API endpoint (update with your Railway URL)
VITE_API_URL=https://your-api.railway.app
```

### 3. Build Configuration
Vercel auto-detects Vite configuration:
- Framework Preset: Vite
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

### Expected Frontend:
- `https://your-app.vercel.app` - Main dashboard
- Auto-deploy: Enabled for main branch
- Custom domain: Optional (configure in Vercel)

## 🔒 GitHub Token Setup

### Create GitHub Personal Access Token:
1. GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Generate new token with scopes:
   - `repo` (for private repository access)
   - `read:user` (for user information)
3. Copy token and add to Railway environment variables

### Token Permissions Required:
- Access to `bakescakes/mcp-server-habu` repository
- Read access to STATUS.json and repository metadata

## ✅ Deployment Verification

### 1. API Health Check
```bash
curl https://your-api.railway.app/health
# Expected: {"status":"healthy","timestamp":"...","service":"habu-dashboard-api","version":"1.0.0"}
```

### 2. STATUS.json Endpoint
```bash
curl https://your-api.railway.app/api/status
# Expected: GitHub STATUS.json with _api metadata
```

### 3. Frontend Functionality
1. Visit `https://your-app.vercel.app`
2. Verify real-time data loading
3. Check auto-refresh (30-second intervals)
4. Test navigation between tabs
5. Verify error handling with disconnected API

### 4. CORS Configuration
Ensure Railway API accepts requests from Vercel domain:
- Check ALLOWED_ORIGINS environment variable
- Test browser network tab for CORS errors

## 🔄 Auto-Deployment Workflow

### Backend (Railway):
1. Push to `main` branch
2. Railway automatically builds and deploys
3. Environment variables persist
4. Zero-downtime deployment

### Frontend (Vercel):
1. Push to `main` branch  
2. Vercel builds and deploys
3. Automatic domain updates
4. Instant global CDN distribution

## 🐛 Troubleshooting

### Common Issues:

#### 1. 404 Error on STATUS.json
- **Cause**: Missing or invalid GITHUB_TOKEN
- **Solution**: Verify token has repository access

#### 2. CORS Errors
- **Cause**: Missing domain in ALLOWED_ORIGINS
- **Solution**: Add Vercel domain to Railway environment

#### 3. Build Failures
- **Backend**: Check Node.js version compatibility
- **Frontend**: Verify all dependencies installed

#### 4. Connection Errors
- **Dashboard shows "connecting"**: API server may be down
- **Check**: Railway deployment logs and health endpoint

## 📊 Monitoring & Analytics

### Railway Monitoring:
- Built-in metrics and logging
- Custom alerts for downtime
- Resource usage tracking

### Vercel Analytics:
- Performance monitoring
- Core Web Vitals tracking
- Real User Monitoring (RUM)

## 🔐 Security Considerations

### Environment Variables:
- Never commit `.env` files
- Use Railway/Vercel secure variable storage
- Rotate GitHub tokens periodically

### API Security:
- CORS properly configured
- Rate limiting (future enhancement)
- Input validation on all endpoints

## 🚀 Production Optimization

### Performance:
- API responses cached appropriately
- Frontend build optimized for production
- CDN distribution via Vercel

### Reliability:
- Auto-restart policies configured
- Health checks implemented
- Error boundaries in React app

## 📈 Success Metrics

### Key Performance Indicators:
- API response time < 500ms
- Frontend load time < 2 seconds
- 99.9% uptime target
- Zero failed deployments

### Monitoring URLs:
- Railway API: `https://your-api.railway.app/health`
- Vercel Frontend: `https://your-app.vercel.app`
- GitHub Source: `https://github.com/bakescakes/mcp-server-habu`

---

**Ready for Production**: This dashboard is designed for immediate stakeholder presentation and public deployment with zero manual maintenance required.