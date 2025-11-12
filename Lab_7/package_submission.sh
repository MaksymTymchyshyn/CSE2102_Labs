#!/bin/bash

# Script to package Lab 7 for submission
# Creates a zip file with all necessary files

echo "============================================"
echo "Lab 7: Packaging for Submission"
echo "============================================"
echo ""

# Get the current directory
LAB_DIR="$(cd "$(dirname "$0")" && pwd)"
SUBMISSION_DIR="${LAB_DIR}/submission"
ZIP_FILE="${LAB_DIR}/Lab7_Quiz_Server_Submission.zip"

# Create submission directory
echo "Creating submission directory..."
rm -rf "${SUBMISSION_DIR}"
mkdir -p "${SUBMISSION_DIR}"

# Copy project files
echo "Copying project files..."
cp -r "${LAB_DIR}/quiz-server" "${SUBMISSION_DIR}/"

# Copy documentation
echo "Copying documentation..."
cp "${LAB_DIR}/README.md" "${SUBMISSION_DIR}/"
cp "${LAB_DIR}/IMPLEMENTATION_SUMMARY.md" "${SUBMISSION_DIR}/"
cp "${LAB_DIR}/VIDEO_RECORDING_GUIDE.md" "${SUBMISSION_DIR}/"
cp "${LAB_DIR}/demo.sh" "${SUBMISSION_DIR}/"

# Clean up build artifacts and cache
echo "Cleaning build artifacts..."
rm -rf "${SUBMISSION_DIR}/quiz-server/target"
rm -rf "${SUBMISSION_DIR}/quiz-server/.mvn"

# Create HOW_TO_RUN.txt
echo "Creating HOW_TO_RUN.txt..."
cat > "${SUBMISSION_DIR}/HOW_TO_RUN.txt" << 'EOF'
===========================================
Lab 7: Thymeleaf Quiz Server
How to Run Instructions
===========================================

PREREQUISITES:
--------------
- Java 11 or higher installed
- Maven 3.6 or higher installed
- A web browser

QUICK START:
------------
1. Unzip this submission package
2. Open a terminal/command prompt
3. Navigate to the quiz-server directory:
   cd quiz-server

4. Run the application:
   mvn spring-boot:run

5. Open your browser to:
   http://localhost:8080

6. To stop the server, press Ctrl+C in the terminal

RUNNING TESTS:
--------------
To run all tests:
   mvn test

To build the project:
   mvn clean package

TESTING MULTI-USER FUNCTIONALITY:
----------------------------------
1. Start the application (mvn spring-boot:run)
2. Open http://localhost:8080 in your browser
3. Enter a name and start a quiz
4. Open the same URL in another browser window/tab
   (or use incognito/private mode)
5. Enter a different name and start another quiz
6. Both users can take quizzes independently!

PROJECT STRUCTURE:
------------------
quiz-server/
├── src/
│   ├── main/
│   │   ├── java/com/example/quiz/
│   │   │   ├── QuizApplication.java     - Main application
│   │   │   ├── QuizController.java      - Web controller
│   │   │   ├── QuizService.java         - Business logic
│   │   │   ├── Quiz.java                - Quiz model
│   │   │   └── Question.java            - Question model
│   │   └── resources/
│   │       ├── templates/                - Thymeleaf templates
│   │       │   ├── index.html
│   │       │   ├── question.html
│   │       │   ├── results.html
│   │       │   └── error.html
│   │       └── application.properties
│   └── test/
│       └── java/com/example/quiz/       - Test files
└── pom.xml                              - Maven configuration

FEATURES:
---------
✓ Multiple simultaneous quiz takers
✓ 10 multiple-choice questions
✓ Real-time progress tracking
✓ Instant score calculation
✓ Performance-based feedback
✓ Responsive web design
✓ 78 comprehensive tests

TROUBLESHOOTING:
----------------
If port 8080 is already in use:
- Stop other applications using port 8080
- Or modify src/main/resources/application.properties
  Add: server.port=8081

If Maven command not found:
- Make sure Maven is installed
- Check that Maven is in your PATH

If tests fail:
- Make sure you have Java 11+ installed
- Try: mvn clean install

DOCUMENTATION:
--------------
- README.md                  - Detailed project documentation
- IMPLEMENTATION_SUMMARY.md  - What was implemented
- VIDEO_RECORDING_GUIDE.md   - Guide for recording demo video

CONTACT:
--------
For questions, refer to the documentation or contact the instructor.

Good luck running the quiz server!
EOF

# Create zip file
echo "Creating zip file..."
cd "${LAB_DIR}"
rm -f "${ZIP_FILE}"
cd submission
zip -r "${ZIP_FILE}" . -x "*.DS_Store" -x "__MACOSX/*"
cd ..

# Cleanup
echo "Cleaning up..."
rm -rf "${SUBMISSION_DIR}"

# Show result
echo ""
echo "============================================"
echo "✅ Submission package created successfully!"
echo "============================================"
echo ""
echo "File: ${ZIP_FILE}"
echo "Size: $(du -h "${ZIP_FILE}" | cut -f1)"
echo ""
echo "Contents:"
unzip -l "${ZIP_FILE}" | head -20
echo ""
echo "Ready to submit!"
echo ""
