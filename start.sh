#!/bin/bash
# Simple script to start the local web server

echo "Starting Ties game server..."
echo "Open http://localhost:8000 in your browser"
echo "Press Ctrl+C to stop the server"
echo ""

# Try Python first, then fall back to Node.js http-server
if command -v python3 &> /dev/null; then
    python3 -m http.server 8000
elif command -v python &> /dev/null; then
    python -m http.server 8000
elif command -v npx &> /dev/null; then
    npx http-server -p 8000
else
    echo "Error: Neither Python nor Node.js found. Please install one of them."
    exit 1
fi
