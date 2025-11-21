#!/bin/bash
# deploy-frontend.sh
# Automated frontend deployment script for celestial.se
# Builds React app and syncs to production server (excluding server-side assets)

set -e  # Exit on error

echo "🚀 Starting frontend deployment..."

# Get script directory (works even if called from elsewhere)
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

# Build production bundle
echo "📦 Building production bundle..."
npm run build

# Deploy to server (exclude server-side assets)
echo "🌐 Deploying to celestial.se..."
rsync -avz --delete \
  --exclude 'ovningsunderlag/' \
  --exclude 'mock-attachments/' \
  dist/ yourusername@celestial.se:/var/www/tic-tac-toe/

echo "✅ Frontend deployment complete!"
echo ""
echo "🔗 Live at: https://celestial.se/"
