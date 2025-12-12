#!/bin/bash
# Demo script for Lab 09: Web-tokens
# This script demonstrates the web token service functionality

echo "=============================================="
echo "Lab 09: Web Token Service Demo"
echo "=============================================="
echo ""

# Check if Flask is installed
if ! python3 -c "import flask" 2>/dev/null; then
    echo "Installing Flask..."
    pip3 install Flask
fi

# Check if httpx is installed
if ! python3 -c "import httpx" 2>/dev/null; then
    echo "Installing httpx..."
    pip3 install httpx
fi

echo "Starting Flask server in the background..."
python3 my-server.py > server.log 2>&1 &
SERVER_PID=$!
echo "Server PID: $SERVER_PID"

# Wait for server to start
echo "Waiting for server to start..."
sleep 3

# Check if server is running
if ps -p $SERVER_PID > /dev/null; then
    echo "✓ Server is running!"
    echo ""
    
    echo "=============================================="
    echo "Running client tests..."
    echo "=============================================="
    python3 my-calls.py
    
    echo ""
    echo "=============================================="
    echo "Running unit tests..."
    echo "=============================================="
    python3 test_token_service.py
    
    echo ""
    echo "=============================================="
    echo "Demo completed!"
    echo "=============================================="
    
    # Stop the server
    echo ""
    echo "Stopping server..."
    kill $SERVER_PID
    echo "Server stopped."
else
    echo "✗ Failed to start server"
    exit 1
fi

echo ""
echo "Check server.log for server output"
