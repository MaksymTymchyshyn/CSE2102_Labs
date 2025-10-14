#!/bin/bash

# Demo script for Lab 5 Flask Pub-Sub Server
# This script demonstrates all the functionality of the pub-sub server

echo "=== Lab 5 Flask Pub-Sub Server Demo ==="
echo

# Check if server is running
echo "1. Checking server status..."
curl -s http://localhost:5000/ | python -m json.tool
echo

echo "2. Adding subscribers..."
echo "   Adding Alice..."
curl -s -X POST http://localhost:5000/subscribers \
  -H "Content-Type: application/json" \
  -d '{"name": "alice", "url": "http://alice.com/webhook"}' | python -m json.tool
echo

echo "   Adding Bob..."
curl -s -X POST http://localhost:5000/subscribers \
  -H "Content-Type: application/json" \
  -d '{"name": "bob", "url": "http://bob.com/webhook"}' | python -m json.tool
echo

echo "   Adding Charlie..."
curl -s -X POST http://localhost:5000/subscribers \
  -H "Content-Type: application/json" \
  -d '{"name": "charlie", "url": "http://charlie.com/webhook"}' | python -m json.tool
echo

echo "3. Listing all subscribers..."
curl -s http://localhost:5000/subscribers | python -m json.tool
echo

echo "4. Publishing a subject (check server console for notifications)..."
curl -s -X POST http://localhost:5000/publish \
  -H "Content-Type: application/json" \
  -d '{"subject": "Breaking News: Lab 5 is working!"}' | python -m json.tool
echo

echo "5. Getting current subject..."
curl -s http://localhost:5000/subject | python -m json.tool
echo

echo "6. Deleting a subscriber..."
echo "   Deleting Bob..."
curl -s -X DELETE http://localhost:5000/subscribers/bob | python -m json.tool
echo

echo "7. Listing subscribers after deletion..."
curl -s http://localhost:5000/subscribers | python -m json.tool
echo

echo "8. Publishing another subject with fewer subscribers..."
curl -s -X POST http://localhost:5000/publish \
  -H "Content-Type: application/json" \
  -d '{"subject": "Update: Bob has been removed"}' | python -m json.tool
echo

echo "9. Testing error cases..."
echo "   Trying to add duplicate subscriber..."
curl -s -X POST http://localhost:5000/subscribers \
  -H "Content-Type: application/json" \
  -d '{"name": "alice", "url": "http://alice-new.com/webhook"}' | python -m json.tool
echo

echo "   Trying to delete non-existent subscriber..."
curl -s -X DELETE http://localhost:5000/subscribers/dave | python -m json.tool
echo

echo "   Trying to publish without subject..."
curl -s -X POST http://localhost:5000/publish \
  -H "Content-Type: application/json" \
  -d '{}' | python -m json.tool
echo

echo "=== Demo completed! ==="
echo "Check the server console to see the notification messages."