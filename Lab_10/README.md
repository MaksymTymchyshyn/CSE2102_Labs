# Lab 10: JWT

**Course:** CSE2102 - Software Engineering  

## Objective

Build a service that uses JWT (JSON Web Tokens) for authentication. The service accepts JWT tokens for identity verification, with tokens containing user information, unique identifiers, and expiration times.

## Project Structure

```
Lab_10/
├── my-server.py           # Flask server with JWT endpoints
├── my-calls.py            # Client for testing the service
├── test_jwt_service.py    # Unit and functional tests
├── requirements.txt       # Python dependencies
├── demo.sh               # Automated demo script
├── README.md             # This file
└── IMPLEMENTATION_SUMMARY.md  # Detailed implementation notes
```

## Features

### Server Endpoints

1. **`GET /`** - Home endpoint with service information
2. **`POST /generate-token`** - Generate a new JWT token for a user ID
3. **`POST /verify-token`** - Verify if a JWT token is valid
4. **`POST /login`** - Login with user ID and JWT token
5. **`POST /revoke-token`** - Revoke a JWT token (logout)

### JWT Token Structure

JWT tokens contain the following claims:
- `jti` (JWT ID) - Unique identifier for the token (UUID v4)
- `user_id` - The user identifier
- `exp` - Expiration timestamp
- `iat` - Issued at timestamp

Example JWT payload:
```json
{
  "jti": "925a4dfa-86b7-4c06-8f3e-fdccb0a748b2",
  "user_id": 123,
  "exp": 1734025200,
  "iat": 1734021600
}
```

## Installation

### Prerequisites

- Python 3.7+
- pip3

### Install Dependencies

```bash
pip3 install -r requirements.txt
```

Or install manually:
```bash
pip3 install Flask PyJWT httpx
```

## Running the Service

### Method 1: Automated Demo

Run the complete demo with tests:
```bash
chmod +x demo.sh
./demo.sh
```

### Method 2: Manual Setup

#### Terminal 1: Start the Server

```bash
python3 my-server.py
```

Server will start on `http://localhost:5000`

#### Terminal 2: Run the Client

```bash
python3 my-calls.py
```

Or specify a custom URL:
```bash
python3 my-calls.py http://your-codespace-url:5000/
```

## Running Tests

### Unit and Functional Tests

```bash
python3 test_jwt_service.py
```

This runs comprehensive tests including:
- Token generation with default and custom expiration
- Token verification with valid and invalid tokens
- Expiration handling
- Login with JSON and form data
- Token revocation
- Complete workflow testing

## API Usage Examples

### Generate Token

**Request:**
```bash
curl -X POST http://localhost:5000/generate-token \
  -H "Content-Type: application/json" \
  -d '{"user_id": 123, "expires_in": 3600}'
```

**Response:**
```json
{
  "user_id": 123,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expires_in": 3600
}
```

### Verify Token

**Request:**
```bash
curl -X POST http://localhost:5000/verify-token \
  -H "Content-Type: application/json" \
  -d '{"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...", "user_id": 123}'
```

**Response:**
```json
{
  "valid": true,
  "user_id": 123,
  "jti": "925a4dfa-86b7-4c06-8f3e-fdccb0a748b2",
  "exp": 1734025200
}
```

### Login

**Request:**
```bash
curl -X POST http://localhost:5000/login \
  -H "Content-Type: application/json" \
  -d '{"user_id": 123, "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."}'
```

**Response:**
```json
{
  "message": "Login successful",
  "user_id": 123
}
```

### Revoke Token

**Request:**
```bash
curl -X POST http://localhost:5000/revoke-token \
  -H "Content-Type: application/json" \
  -d '{"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."}'
```

**Response:**
```json
{
  "message": "Token revoked successfully"
}
```

## Key Features

### JWT Benefits Over Simple Tokens

1. **Self-contained** - Token contains all user information
2. **Signed** - Cryptographically signed to prevent tampering
3. **Expiration** - Built-in expiration mechanism
4. **Stateless** - No need to store tokens (except for revocation list)
5. **Standard** - Industry-standard format (RFC 7519)

### Security Features

- HMAC SHA-256 (HS256) signing algorithm
- Configurable token expiration
- Token revocation support (blacklist)
- User ID validation
- Automatic expiration checking

### Error Handling

The service properly handles:
- Invalid JWT format
- Expired tokens
- Revoked tokens
- Signature verification failures
- Missing required fields
- User ID mismatches

## Testing

The test suite includes **25+ comprehensive tests**:

- **Token Generation Tests**: Default expiration, custom expiration, unique JTI
- **Token Verification Tests**: Valid tokens, invalid tokens, expired tokens, revoked tokens
- **Login Tests**: JSON data, form data, invalid tokens, mismatched user IDs
- **Token Revocation Tests**: Successful revocation, verification after revocation
- **Functional Tests**: Complete workflow, JWT payload structure

## Security Note

**Important**: This implementation uses a hardcoded `SECRET_KEY` for demonstration purposes. In production:

1. Use a strong, randomly generated secret key
2. Store the secret in environment variables
3. Never commit secrets to version control
4. Consider using asymmetric keys (RS256) for multi-service architectures
5. Implement token refresh mechanisms
6. Use HTTPS in production

## Comparison with Lab 09

| Feature | Lab 09 (UUID) | Lab 10 (JWT) |
|---------|---------------|--------------|
| Token Type | UUID v4 | JWT (signed) |
| Token Size | 36 characters | ~150+ characters |
| Contains Data | No | Yes (payload) |
| Self-contained | No | Yes |
| Expiration | Manual | Built-in |
| Tampering Protection | None | Cryptographic signature |
| Industry Standard | No | Yes (RFC 7519) |

## Troubleshooting

### Server won't start
- Check if port 5000 is already in use: `lsof -i :5000`
- Install dependencies: `pip3 install -r requirements.txt`

### Token verification fails
- Ensure the SECRET_KEY matches between generation and verification
- Check if token has expired
- Verify the token wasn't modified

### Tests fail
- Clear `__pycache__` directories: `rm -rf __pycache__`
- Ensure server is not running during tests (tests use test client)
