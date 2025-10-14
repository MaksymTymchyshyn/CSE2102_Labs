#!/bin/bash

PORT=5002
BASE_URL="http://localhost:$PORT"

echo "=== Testing Flask Pub-Sub Server on port $PORT ==="
echo

echo "1. Health Check:"
curl -s $BASE_URL/ && echo

echo -e "\n2. Adding subscribers:"
echo "   Adding Alice..."
curl -s -X POST $BASE_URL/subscribers -H "Content-Type: application/json" -d '{"name": "alice", "url": "http://alice.com/webhook"}' && echo

echo "   Adding Bob..."
curl -s -X POST $BASE_URL/subscribers -H "Content-Type: application/json" -d '{"name": "bob", "url": "http://bob.com/webhook"}' && echo

echo -e "\n3. Listing subscribers:"
curl -s $BASE_URL/subscribers && echo

echo -e "\n4. Publishing subject:"
curl -s -X POST $BASE_URL/publish -H "Content-Type: application/json" -d '{"subject": "Test Subject"}' && echo

echo -e "\n5. Getting current subject:"
curl -s $BASE_URL/subject && echo

echo -e "\n6. Deleting subscriber Bob:"
curl -s -X DELETE $BASE_URL/subscribers/bob && echo

echo -e "\n7. Final subscriber list:"
curl -s $BASE_URL/subscribers && echo

echo -e "\n=== Test completed! ==="
