#!/bin/bash

# Sober Living App Deployment Script
# This script builds and prepares the site for deployment

set -e

echo "🚀 Starting deployment process..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Run pre-build tasks
echo "🔧 Running pre-build tasks..."
npm run prebuild

# Build the site
echo "🏗️ Building site..."
npm run build

# Verify build output
if [ ! -d "dist" ]; then
    echo "❌ Error: Build failed - dist directory not found"
    exit 1
fi

echo "✅ Build completed successfully!"

# Check build size
BUILD_SIZE=$(du -sh dist | cut -f1)
echo "📊 Build size: $BUILD_SIZE"

# List key files
echo "📁 Key build files:"
ls -la dist/ | head -10

# Verify critical files exist
echo "🔍 Verifying critical files..."
if [ -f "dist/index.html" ]; then
    echo "✅ index.html found"
else
    echo "❌ index.html missing"
    exit 1
fi

if [ -f "dist/blog/index.html" ]; then
    echo "✅ blog/index.html found"
else
    echo "❌ blog/index.html missing"
    exit 1
fi

if [ -f "dist/sitemap-index.xml" ]; then
    echo "✅ sitemap-index.xml found"
else
    echo "❌ sitemap-index.xml missing"
    exit 1
fi

echo "🎉 Deployment preparation complete!"
echo ""
echo "📋 Next steps:"
echo "1. Push to GitHub: git push origin main"
echo "2. Connect to Netlify for automatic deployment"
echo "3. Configure custom domain in Netlify dashboard"
echo "4. Set up environment variables if needed"
echo ""
echo "📚 See DEPLOYMENT.md for detailed instructions" 