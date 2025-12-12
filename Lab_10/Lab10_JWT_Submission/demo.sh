#!/bin/bash
# Demo script for Lab 10: JWT
# This script demonstrates the JWT token service functionality

echo "=============================================="
echo "Lab 10: JWT Token Service Demo"
echo "=============================================="
echo ""

# Check if Flask is installed
if ! python3 -c "import flask" 2>/dev/null; then
    echo "Installing Flask..."
    pip3 install Flask
fi

# Check if PyJWT is installed
if ! python3 -c "import jwt" 2>/dev/null; then
    echo "Installing PyJWT..."
    pip3 install PyJWT
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
    python3 test_jwt_service.py
    
    echo ""
    echo "=============================================="
    echo "Demo completed!"
    echo "=============================================="
    
    # Stop the server
    echo "Stopping server..."
    kill $SERVER_PID 2>/dev/null
    echo "✓ Server stopped"
else
    echo "✗ Server failed to start"
    exit 1
fi
