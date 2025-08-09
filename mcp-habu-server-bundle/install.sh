#!/bin/bash

echo "🚀 Installing MCP Server for Habu..."

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js v18+ first."
    echo "   Download from: https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version $NODE_VERSION found. Please upgrade to v18+."
    exit 1
fi

echo "✅ Node.js $(node --version) found"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the server
echo "🔨 Building TypeScript server..."
npm run build

# Check for .env file
if [ ! -f ".env" ]; then
    echo "⚠️  Environment file not found. Creating from template..."
    cp .env.template .env
    echo "📝 Please edit .env file with your Habu API credentials before testing."
else
    echo "✅ Environment file found"
fi

echo ""
echo "🎉 Installation complete!"
echo ""
echo "Next steps:"
echo "1. Edit .env file with your Habu API credentials"
echo "2. Test connection: node test-oauth.js"
echo "3. Add to your MCP client configuration"
echo ""
echo "See README.md for detailed setup instructions."
