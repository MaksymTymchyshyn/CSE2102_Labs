#!/bin/bash

echo "Starting Flask server..."
cd /workspaces/CSE2102_Labs/Lab_4
python my_server.py &
SERVER_PID=$!

echo "Waiting for server to start..."
sleep 3

echo "========================================="
echo "Testing Basic HTTP Endpoint"
echo "========================================="
curl http://localhost:5000/

echo -e "\n========================================="
echo "Testing Echo Endpoint"
echo "========================================="
curl -d "text=Hello World!" -X POST http://localhost:5000/echo

echo -e "\n========================================="
echo "Testing Factors Endpoint - Composite Number (12)"
echo "========================================="
curl -d "number=12" -X POST http://localhost:5000/factors

echo -e "\n========================================="
echo "Testing Factors Endpoint - Prime Number (7)"
echo "========================================="
curl -d "number=7" -X POST http://localhost:5000/factors

echo -e "\n========================================="
echo "Testing Factors Endpoint - Large Composite (360)"
echo "========================================="
curl -d "number=360" -X POST http://localhost:5000/factors

echo -e "\n========================================="
echo "Testing Factors Endpoint - Edge Case (1)"
echo "========================================="
curl -d "number=1" -X POST http://localhost:5000/factors

echo -e "\n========================================="
echo "Testing Error Handling - Invalid Input"
echo "========================================="
curl -d "number=abc" -X POST http://localhost:5000/factors

echo -e "\n========================================="
echo "Stopping server..."
kill $SERVER_PID
echo "Demo complete!"