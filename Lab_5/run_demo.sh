#!/bin/bash

# Lab 5 Demonstration Script
# This script demonstrates the Flask Pub-Sub server functionality

echo "========================================"
echo "Lab 5: Flask Pub-Sub Server Demonstration"
echo "========================================"
echo

# Show project structure
echo "1. Project Structure:"
echo "---------------------"
ls -la
echo

# Run unit tests to demonstrate functionality
echo "2. Running Unit Tests:"
echo "----------------------"
python -m pytest test_app.py -v
echo

echo "3. Starting Flask Server for Manual Testing:"
echo "--------------------------------------------"
echo "To manually test the server, run these commands in separate terminals:"
echo
echo "Terminal 1 - Start Server:"
echo "  cd /workspaces/CSE2102_Labs/Lab_5"
echo "  python app.py"
echo
echo "Terminal 2 - Test with curl:"
echo "  # Health check"
echo '  curl -s http://localhost:5000/ | python -m json.tool'
echo
echo "  # Add subscribers"
echo '  curl -X POST http://localhost:5000/subscribers -H "Content-Type: application/json" -d '\''{"name": "alice", "url": "http://alice.com/webhook"}'\'''
echo '  curl -X POST http://localhost:5000/subscribers -H "Content-Type: application/json" -d '\''{"name": "bob", "url": "http://bob.com/webhook"}'\'''
echo
echo "  # List subscribers"
echo '  curl -s http://localhost:5000/subscribers | python -m json.tool'
echo
echo "  # Publish subject (watch server console for notifications)"
echo '  curl -X POST http://localhost:5000/publish -H "Content-Type: application/json" -d '\''{"subject": "Breaking News!"}'\'''
echo
echo "  # Delete subscriber"
echo '  curl -X DELETE http://localhost:5000/subscribers/alice'
echo
echo "  # List subscribers again"
echo '  curl -s http://localhost:5000/subscribers | python -m json.tool'
echo

echo "4. All Requirements Implemented:"
echo "--------------------------------"
echo "✅ Subscribers stored in HTTP server"
echo "✅ POST endpoint for adding subscribers (name + URL)"
echo "✅ DELETE endpoint for deleting subscribers by name"
echo "✅ GET endpoint for listing all subscribers"
echo "✅ POST endpoint for publishing subjects and notifying subscribers"
echo "✅ Print statements show backend notifications"
echo "✅ Server runs in one terminal, testing in another"
echo "✅ Comprehensive unit tests included"
echo "✅ Complete documentation provided"
echo

echo "========================================"
echo "Lab 5 Implementation Complete!"
echo "========================================"