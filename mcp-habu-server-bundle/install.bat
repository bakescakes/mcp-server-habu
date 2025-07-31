@echo off
echo 🚀 Installing MCP Server for Habu...

:: Check Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js not found. Please install Node.js v18+ first.
    echo    Download from: https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js found: 
node --version

:: Install dependencies
echo 📦 Installing dependencies...
npm install

:: Build the server
echo 🔨 Building TypeScript server...
npm run build

:: Check for .env file
if not exist ".env" (
    echo ⚠️  Environment file not found. Creating from template...
    copy .env.template .env
    echo 📝 Please edit .env file with your Habu API credentials before testing.
) else (
    echo ✅ Environment file found
)

echo.
echo 🎉 Installation complete!
echo.
echo Next steps:
echo 1. Edit .env file with your Habu API credentials
echo 2. Test connection: node test-oauth.js  
echo 3. Add to your MCP client configuration
echo.
echo See README.md for detailed setup instructions.
pause
