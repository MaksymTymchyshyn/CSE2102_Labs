# Steps Taken - Lab 10: JWT

## Implementation Steps

### Step 1: Project Setup
- Created Lab_10 directory structure
- Created `requirements.txt` with dependencies:
  - Flask 3.0.0 - Web framework
  - PyJWT 2.8.0 - JWT implementation
  - httpx 0.25.2 - HTTP client for testing
  - Werkzeug 3.0.1 - WSGI utilities

### Step 2: Understanding JWT Structure
1. **Researched JWT components:**
   - Header: Algorithm and token type
   - Payload: Claims (jti, user_id, exp, iat)
   - Signature: HMAC SHA-256 verification

2. **Studied RFC 7519 standard:**
   - Registered claims (exp, iat)
   - Public claims (jti)
   - Private claims (user_id)

3. **Planned token structure:**
   ```json
   {
     "jti": "uuid-v4",
     "user_id": 123,
     "exp": timestamp,
     "iat": timestamp
   }
   ```

### Step 3: Flask Server Implementation (`my-server.py`)
1. **Imported required modules:**
   - `Flask` for web framework
   - `jwt` (PyJWT) for JWT operations
   - `datetime` for expiration handling
   - `uuid` for JTI generation
   - `logging` for debugging

2. **Configured JWT settings:**
   - Set `SECRET_KEY` for signing
   - Chose HS256 algorithm (HMAC SHA-256)
   - Set default expiration: 1 hour (3600 seconds)

3. **Set up revocation list:**
   - Created `revoked_tokens` set for JTI blacklist
   - Enables logout functionality
   - Trade-off: Requires server-side state

4. **Implemented endpoints:**
   - `GET /` - Home endpoint with API documentation
   - `POST /generate-token` - Generate signed JWT with configurable expiration
   - `POST /verify-token` - Verify signature, expiration, and claims
   - `POST /login` - Authenticate with JWT validation
   - `POST /revoke-token` - Add JTI to blacklist

5. **Added JWT-specific error handling:**
   - `jwt.ExpiredSignatureError` - Token expired
   - `jwt.InvalidTokenError` - Invalid signature or format
   - JTI revocation check
   - User ID validation

### Step 4: Client Implementation (`my-calls.py`)
1. **Created test functions:**
   - `test_server_connection()` - Verify server
   - `generate_token()` - Request JWT with custom expiration
   - `verify_token()` - Validate JWT
   - `login()` - Authenticate with JWT
   - `test_invalid_token()` - Test signature verification
   - `test_expired_token()` - **New:** Test expiration with wait
   - `revoke_token()` - Logout

2. **Implemented JWT-specific features:**
   - Display token preview (first 50 chars)
   - Show expiration time
   - Test expired tokens (generate 2-second token, wait 3 seconds)
   - Demonstrate cryptographic security

3. **Added workflow:**
   - Connection → Generation → Verification → Login → Invalid test → **Expiration test** → Revocation

### Step 5: Test Suite Implementation (`test_jwt_service.py`)
1. **Set up test infrastructure:**
   - Used `unittest` framework
   - Created Flask test client
   - Imported `SECRET_KEY` for manual token decoding
   - Added `time.sleep()` for expiration tests

2. **Created test categories:**
   - **Token Generation Tests (5 tests):**
     - Default expiration
     - Custom expiration
     - Missing user_id
     - No JSON data
     - Unique JTI (5 tokens tested)
   
   - **Token Verification Tests (6 tests):**
     - Valid token
     - Invalid token
     - **Expired token** (waits 2 seconds)
     - User ID matching
     - User ID mismatch
     - Missing token field
   
   - **Login Tests (5 tests):**
     - JSON data
     - Form data
     - Invalid token
     - User ID mismatch
     - Missing fields
   
   - **Token Revocation Tests (3 tests):**
     - Successful revocation
     - Verify after revocation
     - Invalid token revocation
   
   - **Functional Tests (3 tests):**
     - Complete workflow
     - Home endpoint
     - **JWT payload structure validation**

3. **Total: 22 comprehensive tests**

### Step 6: JWT-Specific Testing
1. **Expiration testing:**
   - Generate token with 1-second expiration
   - Wait 2 seconds
   - Verify rejection with "expired" message

2. **Signature testing:**
   - Test invalid JWT format
   - Test tampered tokens
   - Verify signature validation

3. **Payload validation:**
   - Decode token without verification
   - Check for required claims (jti, user_id, exp, iat)
   - Verify claim values

### Step 7: Documentation
1. **README.md:**
   - JWT structure explanation
   - Comparison with Lab 09 (UUID vs JWT)
   - Security features
   - API usage examples
   - JWT benefits section

2. **IMPLEMENTATION_SUMMARY.md:**
   - Detailed JWT implementation
   - Design decisions (HS256 vs RS256)
   - Security considerations
   - Improvements over Lab 09
   - Production recommendations

3. **VIDEO_GUIDE.md:**
   - How to demonstrate JWT features
   - jwt.io integration instructions
   - Highlighting expiration mechanism

### Step 8: Automation Scripts
1. **demo.sh:**
   - Automatic PyJWT installation
   - Background server startup
   - Client test execution (includes 3-second wait)
   - Unit test execution
   - Server cleanup

2. **package_submission.sh:**
   - Creates submission directory
   - Copies all files
   - Generates zip file
   - Shows checklist

3. **verify_submission.sh:**
   - Checks files
   - Verifies JWT implementation (jwt.encode, jwt.decode)
   - Runs tests
   - Validates documentation

### Step 9: Testing and Validation
1. **Ran unit tests:**
   - All 22 tests passing in ~2 seconds
   - Expiration test adds 2-second delay
   - 100% endpoint coverage

2. **Tested JWT features:**
   - Token generation with signing
   - Signature verification
   - Expiration mechanism
   - Revocation via blacklist

3. **Verified security:**
   - Tampered tokens rejected
   - Expired tokens rejected
   - Revoked tokens rejected

### Step 10: Final Verification
1. **Created submission package:**
   - `Lab10_JWT_Submission.zip`
   - All source files and documentation

2. **Verified completeness:**
   - All JWT features working
   - All tests passing
   - Documentation complete
   - Ready for submission (except video)

## Key Decisions Made

### 1. Algorithm: HS256 (HMAC SHA-256)
- **Reason:** Symmetric signing, simpler for single-service
- **Benefit:** Fast, secure, widely supported
- **Alternative:** RS256 (asymmetric) for multi-service architectures

### 2. JTI for Revocation
- **Reason:** Need unique identifier for blacklist
- **Benefit:** UUID v4 ensures uniqueness
- **Trade-off:** Requires server-side state (similar to Lab 09)

### 3. Configurable Expiration
- **Reason:** Different use cases need different lifetimes
- **Default:** 1 hour (3600 seconds)
- **Benefit:** Flexibility for clients

### 4. Self-Contained Tokens
- **Reason:** JWT standard includes payload data
- **Benefit:** No database lookup needed for verification
- **Trade-off:** Larger token size (~150+ bytes)

### 5. Revocation via Blacklist
- **Reason:** JWT is stateless, but logout requires state
- **Solution:** Track revoked JTIs in set
- **Production:** Use Redis with TTL matching token expiration

### 6. Comprehensive Security
- **Signature verification:** Prevents tampering
- **Expiration checking:** Automatic with PyJWT
- **User ID validation:** Ensures token ownership
- **Revocation support:** Enables logout

## Challenges Encountered and Solutions

### Challenge 1: Token Expiration Testing
- **Problem:** Hard to test expiration without long waits
- **Solution:** Generate tokens with 1-2 second expiration, use `time.sleep()`

### Challenge 2: Revocation in Stateless System
- **Problem:** JWT designed to be stateless, but revocation needs state
- **Solution:** Implement JTI blacklist; recommend Redis for production

### Challenge 3: Secret Key Management
- **Problem:** Demo needs hardcoded key, production needs security
- **Solution:** Document security note, recommend environment variables

### Challenge 4: Time-Based Test Flakiness
- **Problem:** Tests with sleep() can be unreliable
- **Solution:** Use reasonable sleep times (2-3 seconds), document behavior

## Improvements Over Lab 09

| Feature | Lab 09 (UUID) | Lab 10 (JWT) | Improvement |
|---------|---------------|--------------|-------------|
| Security | No tampering protection | Cryptographic signature | Much better |
| Data | Separate storage | Self-contained payload | Reduces server load |
| Expiration | Manual implementation | Built-in exp claim | Automatic |
| Standards | Custom approach | RFC 7519 | Industry standard |
| Size | 36 bytes | ~150 bytes | Larger |
| Verification | Database lookup | Signature check | Faster |

## Learning Outcomes

### Technical Skills
1. **JWT Implementation:**
   - Token generation with PyJWT
   - Signature verification
   - Claims management
   - Expiration handling

2. **Security Concepts:**
   - HMAC SHA-256 signing
   - Token expiration
   - Revocation strategies
   - Secret key management

3. **Testing:**
   - Time-based tests
   - Signature validation tests
   - Payload structure tests

### Best Practices Applied
1. Never store sensitive data in JWT payload
2. Use HTTPS in production
3. Implement token refresh mechanisms
4. Proper error handling for JWT exceptions
5. Environment-based secret keys