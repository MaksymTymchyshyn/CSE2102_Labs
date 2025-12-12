# Steps Taken - Lab 09: Web Tokens

## Implementation Steps

### Step 1: Project Setup
- Created Lab_9 directory structure
- Created `requirements.txt` with dependencies:
  - Flask 3.0.0 - Web framework
  - httpx 0.25.2 - HTTP client for testing
  - Werkzeug 3.0.1 - WSGI utilities

### Step 2: Flask Server Implementation (`my-server.py`)
1. **Imported required modules:**
   - `Flask` for web framework
   - `uuid` for token generation
   - `logging` for debugging

2. **Set up token storage:**
   - Created `token_store` dictionary to map tokens to user IDs
   - Used in-memory storage for simplicity

3. **Implemented endpoints:**
   - `GET /` - Home endpoint with service information
   - `POST /generate-token` - Generate UUID v4 tokens
   - `POST /verify-token` - Verify token validity and user ID
   - `POST /login` - Authenticate with token
   - `POST /revoke-token` - Remove token from storage

4. **Added error handling:**
   - Missing field validation
   - Invalid token detection
   - User ID mismatch handling
   - Comprehensive logging

### Step 3: Client Implementation (`my-calls.py`)
1. **Created test functions:**
   - `test_server_connection()` - Verify server is running
   - `generate_token()` - Request new token from server
   - `verify_token()` - Validate token
   - `login()` - Authenticate with token
   - `test_invalid_token()` - Test error handling
   - `revoke_token()` - Logout functionality

2. **Implemented full workflow:**
   - Server connection → Token generation → Verification → Login → Revocation
   - Added colored output for readability
   - Support for custom server URLs

### Step 4: Test Suite Implementation (`test_token_service.py`)
1. **Set up test infrastructure:**
   - Used `unittest` framework
   - Created Flask test client
   - Implemented `setUp()` and `tearDown()` methods

2. **Created test categories:**
   - **Token Generation Tests (7 tests):**
     - Successful generation
     - Missing ID handling
     - Multiple users
     - UUID uniqueness (100 tokens)
   
   - **Token Verification Tests (5 tests):**
     - Valid token verification
     - Invalid token rejection
     - User ID matching
     - Missing fields
   
   - **Login Tests (5 tests):**
     - JSON and form data
     - Invalid tokens
     - Mismatched user IDs
   
   - **Token Revocation Tests (3 tests):**
     - Successful revocation
     - Nonexistent token handling
     - Post-revocation verification
   
   - **Functional Tests (2 tests):**
     - Complete workflow
     - Concurrent users

3. **Total: 22 comprehensive tests**

### Step 5: Documentation
1. **README.md:**
   - Installation instructions
   - How to run the service
   - API usage examples
   - Troubleshooting guide

2. **IMPLEMENTATION_SUMMARY.md:**
   - Detailed implementation description
   - Design decisions
   - Test coverage
   - Learning outcomes

### Step 6: Automation Scripts
1. **demo.sh:**
   - Automatic dependency installation
   - Background server startup
   - Client test execution
   - Unit test execution
   - Server cleanup

2. **package_submission.sh:**
   - Creates submission directory
   - Copies all required files
   - Generates zip file
   - Shows submission checklist

3. **verify_submission.sh:**
   - Checks all required files
   - Verifies Python syntax
   - Runs test suite
   - Validates documentation

### Step 7: Testing and Validation
1. **Ran unit tests:**
   - All 22 tests passing
   - 100% endpoint coverage

2. **Tested client workflow:**
   - Token generation working
   - Verification working
   - Login working
   - Revocation working

3. **Verified error handling:**
   - Invalid tokens rejected
   - Missing fields handled
   - User ID mismatches detected

### Step 8: Final Verification
1. **Created submission package:**
   - `Lab09_WebTokens_Submission.zip`
   - Contains all source files and documentation

2. **Verified completeness:**
   - All endpoints working
   - All tests passing
   - Documentation complete
   - Ready for submission (except video)

## Key Decisions Made

### 1. Token Format: UUID v4
- **Reason:** Simple, unique, no dependencies
- **Benefit:** Easy to generate and validate
- **Trade-off:** No built-in expiration or data

### 2. In-Memory Storage
- **Reason:** Simplicity for demonstration
- **Benefit:** No database setup needed
- **Trade-off:** Data lost on restart (acceptable for demo)

### 3. Separate Token Store
- **Reason:** Need to map tokens to user IDs
- **Benefit:** Easy lookup and revocation
- **Trade-off:** Requires server-side state

### 4. Comprehensive Testing
- **Reason:** Ensure reliability
- **Benefit:** Catches bugs early
- **Coverage:** All endpoints and error cases

### 5. Dual Data Format Support
- **Reason:** Flexibility in login endpoint
- **Benefit:** Works with JSON and form data
- **Use case:** Different client types

## Challenges Encountered and Solutions

### Challenge 1: Module Import for Tests
- **Problem:** Tests couldn't import `my-server.py` (dash in filename)
- **Solution:** Used `importlib.util` with fallback logic

### Challenge 2: Token Storage Cleanup
- **Problem:** Tests interfered with each other
- **Solution:** Clear `token_store` in `setUp()` and `tearDown()`

### Challenge 3: Background Server in Demo
- **Problem:** Demo script needs to start/stop server automatically
- **Solution:** Used background process with PID tracking and cleanup