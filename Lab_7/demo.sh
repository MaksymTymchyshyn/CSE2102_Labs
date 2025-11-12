#!/bin/bash

# Demo script for Lab 7 Quiz Server
# This script demonstrates the quiz server functionality

echo "=================================="
echo "Lab 7: Thymeleaf Quiz Server Demo"
echo "=================================="
echo ""

# Navigate to the project directory
cd "$(dirname "$0")/quiz-server"

echo "Step 1: Building the project..."
echo "--------------------------------"
mvn clean package -DskipTests
if [ $? -ne 0 ]; then
    echo "Build failed!"
    exit 1
fi
echo ""

echo "Step 2: Running tests..."
echo "------------------------"
mvn test
if [ $? -ne 0 ]; then
    echo "Tests failed!"
    exit 1
fi
echo ""

echo "✅ All tests passed!"
echo ""

echo "Step 3: Starting the application..."
echo "------------------------------------"
echo "The application will start on http://localhost:8080"
echo ""
echo "Features to test:"
echo "  1. Open http://localhost:8080 in your browser"
echo "  2. Enter your name and click 'Start Quiz'"
echo "  3. Answer the 10 questions"
echo "  4. View your results"
echo ""
echo "Multi-user test:"
echo "  1. Open the same URL in multiple browser windows"
echo "  2. Start quizzes with different names"
echo "  3. Each user will have independent quiz sessions"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

mvn spring-boot:run
