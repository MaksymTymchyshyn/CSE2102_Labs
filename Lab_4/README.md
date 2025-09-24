# Lab 4: Basic HTTP with Python Flask

## Objective
This lab demonstrates understanding of the HTTP protocol using Python Flask. The application provides a backend endpoint that receives an integer and returns its prime factors in a list.

## Features

### Endpoints

1. **Root Endpoint (`GET /`)**
   - Returns a welcome message

2. **Echo Endpoint (`POST /echo`)**
   - Original functionality from starter code
   - Echoes back the text sent via form data

3. **Factorization Endpoint (`POST /factors`)**
   - **Main requirement**: Receives an integer and returns its factors
   - Accepts both JSON and form data
   - Returns factors in the format specified in the lab requirements

4. **Factorization GET Endpoint (`GET /factors/<number>`)**
   - Browser-friendly version for easy testing

### Factorization Logic

The application implements the AI-generated trial division algorithm:
- For prime numbers: returns `[number]`
- For composite numbers: returns `[1, factor1, factor2, ...]`
- Uses efficient trial division method

### Examples

- `12` → `[1, 2, 2, 3]` (composite number with factors including 1)
- `7` → `[7]` (prime number)
- `360` → `[1, 2, 2, 2, 3, 3, 5]` (composite number)

## Installation and Setup

### Prerequisites
- Python 3.7 or higher
- pip (Python package installer)

### Installation Steps

1. **Clone/Navigate to the Lab 4 directory**
   ```bash
   cd /workspaces/CSE2102_Labs/Lab_4
   ```

2. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

## Running the System

### Start the Flask Server

```bash
python app.py
```

The server will start on `http://localhost:5000` with debug mode enabled.

### Testing the Application

#### Option 1: Run the Test Client
```bash
python client.py
```

#### Option 2: Manual Testing with curl

**Test the factorization endpoint (JSON):**
```bash
curl -X POST -H "Content-Type: application/json" -d '{"number": 12}' http://localhost:5000/factors
```

**Test the factorization endpoint (form data):**
```bash
curl -d "number=12" -X POST http://localhost:5000/factors
```

**Test the GET endpoint (browser-friendly):**
```bash
curl http://localhost:5000/factors/12
```

**Test the echo endpoint:**
```bash
curl -d "text=Hello!&param2=value2" -X POST http://localhost:5000/echo
```

#### Option 3: Browser Testing
- Open `http://localhost:5000/` for the welcome message
- Open `http://localhost:5000/factors/12` to test factorization via GET

### Running Unit Tests

```bash
python -m unittest test_app.py -v
```

Or run with pytest if available:
```bash
pytest test_app.py -v
```

## API Documentation

### POST /factors

**Request (JSON):**
```json
{
    "number": 12
}
```

**Request (Form Data):**
```
number=12
```

**Response:**
```json
{
    "number": 12,
    "factors": [1, 2, 2, 3],
    "is_prime": false
}
```

### GET /factors/<number>

**Example:** `GET /factors/12`

**Response:**
```json
{
    "number": 12,
    "factors": [1, 2, 2, 3],
    "is_prime": false
}
```

## Implementation Details

### Files Structure
```
Lab_4/
├── app.py              # Main Flask application
├── client.py           # Test client for HTTP calls
├── test_app.py         # Unit tests
├── requirements.txt    # Python dependencies
├── README.md          # This file
├── my-server.py       # Original starter code
└── my-calls.py        # Original starter code
```

### Key Components

1. **trial_division(n)**: AI-generated factorization function using trial division
2. **Flask routes**: HTTP endpoints for different functionalities
3. **Error handling**: Proper validation and error responses
4. **Comprehensive testing**: Unit tests covering various scenarios

### Testing Coverage

The unit tests cover:
- Direct function testing of `trial_division()`
- HTTP endpoint testing (POST with JSON, POST with form data, GET)
- Error handling (invalid inputs, missing parameters)
- Edge cases (primes, composites, large numbers)

## Development Notes

- Built using Flask 2.3.3 for HTTP server functionality
- Uses httpx for HTTP client testing
- Implements proper error handling and validation
- Follows REST API conventions
- Includes both programmatic and browser-friendly interfaces

## Lab Requirements Fulfillment

✅ **Implemented in GitHub CodeSpaces**  
✅ **Added backend endpoint for integer factorization**  
✅ **Returns factors as specified** (prime numbers return `[number]`, composites return factors including 1)  
✅ **Used AI-generated factoring code** (trial division algorithm)  
✅ **Comprehensive unit tests**  
✅ **README with run instructions**  
✅ **Example factorization**: 12 → [1, 2, 2, 3]