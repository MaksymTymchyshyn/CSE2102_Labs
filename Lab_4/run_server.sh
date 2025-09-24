#!/bin/bash

echo "Lab 4: Basic HTTP with Python Flask"
echo "=================================="
echo ""

# Check if Flask is installed
if ! python3 -c "import flask" 2>/dev/null; then
    echo "Installing Flask..."
    pip install flask httpx
fi

echo "Starting Flask server..."
echo "The server will be available at:"
echo "  - http://localhost:5000/"
echo "  - Test factorization: http://localhost:5000/factors/12"
echo ""
echo "API Endpoints:"
echo "  GET  /                    - Welcome message"
echo "  POST /echo               - Echo text back"
echo "  POST /factors            - Get factors (JSON: {\"number\": 12})"
echo "  GET  /factors/<number>   - Get factors (browser-friendly)"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

cd "$(dirname "$0")"
python3 app.py