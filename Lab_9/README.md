# Lab 09: Web-tokens

**Course:** CSE2102 - Software Engineering  

## Objective

Build a service that accepts a UUID web-token for identity. This web token is created by a Flask endpoint, and there is a web-token verification endpoint so a client can have a token generated and stored, then validate the token it received.

## Project Structure

```
Lab_9/
├── my-server.py           # Flask server with token endpoints
├── my-calls.py            # Client for testing the service
├── test_token_service.py  # Unit and functional tests
├── requirements.txt       # Python dependencies
├── demo.sh               # Automated demo script
├── README.md             # This file
└── IMPLEMENTATION_SUMMARY.md  # Detailed implementation notes
```

## Features

### Server Endpoints

1. **`GET /`** - Home endpoint with service information
2. **`POST /generate-token`** - Generate a new UUID token for a user ID
3. **`POST /verify-token`** - Verify if a token is valid
4. **`POST /login`** - Login with user ID and token
5. **`POST /revoke-token`** - Revoke a token (logout)

### Token Format

Tokens follow the UUID v4 format (128-bit random value):
```json
{
  "id": "phillip.bradford@uconn.edu",
  "uuid-token": "925a4dfa-86b7-4c06-8f3e-fdccb0a748b2"
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
pip3 install Flask httpx
```

## Running the Service

### Method 1: Automated Demo

Run the complete demo with tests:
```bash
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
python3 test_token_service.py
```

This runs comprehensive tests including:
- Token generation tests
- Token verification tests
- Login functionality tests
- Token revocation tests
- Complete workflow tests
- Edge cases and error handling

## Usage Examples

### Generate Token

```bash
curl -X POST http://localhost:5000/generate-token \
  -H "Content-Type: application/json" \
  -d '{"id": "user@uconn.edu"}'
```

Response:
```json
{
  "id": "user@uconn.edu",
  "uuid-token": "925a4dfa-86b7-4c06-8f3e-fdccb0a748b2"
}
```

### Verify Token

```bash
curl -X POST http://localhost:5000/verify-token \
  -H "Content-Type: application/json" \
  -d '{"id": "user@uconn.edu", "uuid-token": "925a4dfa-86b7-4c06-8f3e-fdccb0a748b2"}'
```

Response:
```json
{
  "valid": true,
  "id": "user@uconn.edu"
}
```

### Login

```bash
curl -X POST http://localhost:5000/login \
  -d "id=user@uconn.edu&uuid-token=925a4dfa-86b7-4c06-8f3e-fdccb0a748b2"
```

Response:
```json
{
  "success": true,
  "message": "Successfully authenticated as user@uconn.edu"
}
```

### Revoke Token

```bash
curl -X POST http://localhost:5000/revoke-token \
  -H "Content-Type: application/json" \
  -d '{"uuid-token": "925a4dfa-86b7-4c06-8f3e-fdccb0a748b2"}'
```

Response:
```json
{
  "success": true,
  "message": "Token revoked successfully"
}
```

## Accessing from Remote Machine

### Using GitHub Codespaces

1. **Start the server in Codespace:**
   ```bash
   python3 my-server.py
   ```

2. **Forward the port:**
   - VS Code will prompt to forward port 5000
   - Or manually forward in the Ports tab

3. **Run client on your local machine:**
   ```bash
   pip3 install httpx
   python3 my-calls.py https://your-codespace-url:5000/
   ```

## API Documentation

### POST /generate-token

**Request Body:**
```json
{
  "id": "user@example.com"
}
```

**Response (201 Created):**
```json
{
  "id": "user@example.com",
  "uuid-token": "uuid-string"
}
```

**Error Response (400 Bad Request):**
```json
{
  "error": "Missing 'id' field in request"
}
```

### POST /verify-token

**Request Body:**
```json
{
  "id": "user@example.com",
  "uuid-token": "uuid-string"
}
```

**Response (200 OK):**
```json
{
  "valid": true,
  "id": "user@example.com"
}
```

**Error Response (404 Not Found):**
```json
{
  "valid": false,
  "message": "Token not found"
}
```

**Error Response (401 Unauthorized):**
```json
{
  "valid": false,
  "message": "Token does not match provided ID"
}
```

### POST /login

**Request Body (form data or JSON):**
```json
{
  "id": "user@example.com",
  "uuid-token": "uuid-string"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Successfully authenticated as user@example.com"
}
```

**Error Response (401 Unauthorized):**
```json
{
  "success": false,
  "message": "Invalid token"
}
```

### POST /revoke-token

**Request Body:**
```json
{
  "uuid-token": "uuid-string"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Token revoked successfully"
}
```

**Error Response (404 Not Found):**
```json
{
  "success": false,
  "message": "Token not found"
}
```

## Security Considerations

**Note:** This is a demonstration implementation for educational purposes.

In a production environment, you should:
- Use a secure database instead of in-memory storage
- Implement HTTPS/TLS encryption
- Add token expiration times
- Implement rate limiting
- Add proper authentication and authorization
- Use secure session management
- Implement CORS policies
- Add input validation and sanitization
- Use environment variables for configuration
- Implement proper logging and monitoring

## Testing

The project includes comprehensive tests:

- **Unit Tests:** Test individual components (token generation, verification, etc.)
- **Functional Tests:** Test complete workflows
- **Edge Cases:** Test error handling and invalid inputs
- **Concurrent Users:** Test multiple simultaneous users

All tests are in `test_token_service.py` and can be run with:
```bash
python3 test_token_service.py
```

## Deliverables

1. Brief description of implementation
2. Unit tests and functional tests
3. Video demonstration (to be recorded)
4. Code in zip file with instructions

## Creating Submission Package

```bash
cd /workspaces/CSE2102_Labs
zip -r Lab_9_submission.zip Lab_9/
```

## Troubleshooting

### Port Already in Use

If port 5000 is already in use:
```bash
# Find and kill the process
lsof -ti:5000 | xargs kill -9
```

### Module Not Found

Install dependencies:
```bash
pip3 install -r requirements.txt
```

### Connection Refused

Make sure the server is running:
```bash
python3 my-server.py
```

Check if the server is listening:
```bash
curl http://localhost:5000/
```