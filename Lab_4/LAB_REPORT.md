# Lab 4 Report: Basic HTTP with Python Flask

**Student:** [Your Name]  
**Course:** CSE2102 - Software Engineering  
**Professor:** Bradford  
**Date:** September 23, 2025

## What I Did

I implemented a complete Python Flask web application that provides HTTP endpoints for integer factorization, fulfilling all the lab requirements:

### 1. **Implemented Required Factorization Endpoint**
- Created `POST /factors` endpoint that accepts an integer and returns its factors
- For prime numbers: returns `[number]` (e.g., 7 → `[7]`)
- For composite numbers: returns `[1, factor1, factor2, ...]` (e.g., 12 → `[1, 2, 2, 3]`)
- Verified the lab example: input 12 returns exactly `[1, 2, 2, 3]`

### 2. **Used AI-Generated Factorization Algorithm**
- Implemented the provided trial division algorithm exactly as specified
- The algorithm efficiently finds prime factors using trial division method
- Handles edge cases properly (primes, composites, small numbers)

### 3. **Enhanced with Additional Features**
- Added both JSON and form data support for the factorization endpoint
- Created a browser-friendly GET endpoint (`/factors/<number>`)
- Maintained the original echo endpoint from starter code
- Added comprehensive error handling and validation

### 4. **Comprehensive Testing**
- Built extensive unit tests covering all functionality
- Tests verify factorization logic, HTTP endpoints, and error handling
- All 9 unit tests pass successfully
- Tested edge cases including primes, composites, and invalid inputs

### 5. **CodeSpace Implementation**
- Developed entirely in GitHub CodeSpaces as required
- Project structure follows best practices
- Includes proper documentation and run instructions

## Technical Implementation

### Core Components:
- **`app.py`**: Main Flask application with all endpoints
- **`trial_division()`**: AI-generated factorization function
- **`test_app.py`**: Comprehensive unit tests
- **`client.py`**: HTTP client for testing
- **`demo.py`**: Demonstration script showing functionality

### API Endpoints:
1. `GET /` - Welcome message
2. `POST /echo` - Echo functionality (from starter code)
3. `POST /factors` - Main factorization endpoint (JSON/form data)
4. `GET /factors/<number>` - Browser-friendly factorization

### Example Usage:
```bash
# Test with curl (JSON)
curl -X POST -H "Content-Type: application/json" \
     -d '{"number": 12}' http://localhost:5000/factors

# Test with curl (form data)
curl -d "number=12" -X POST http://localhost:5000/factors

# Test in browser
http://localhost:5000/factors/12
```

## Verification Results

### Lab Requirement Verification:
- ✅ **Input 12 returns [1, 2, 2, 3]**: VERIFIED ✓
- ✅ **Prime numbers return [number]**: VERIFIED ✓  
- ✅ **AI-generated factoring code used**: VERIFIED ✓
- ✅ **Implemented in CodeSpaces**: VERIFIED ✓
- ✅ **Unit tests created and passing**: VERIFIED ✓

### Test Results:
```
Ran 9 tests in 0.011s - OK
All unit tests pass successfully
```

### Example Outputs:
- Input: 12 → Output: `[1, 2, 2, 3]` ✓
- Input: 7 → Output: `[7]` ✓
- Input: 360 → Output: `[1, 2, 2, 2, 3, 3, 5]` ✓

## Files Created

```
Lab_4/
├── app.py              # Main Flask application
├── test_app.py         # Unit tests
├── client.py           # HTTP client for testing
├── demo.py             # Demonstration script
├── run_server.sh       # Server startup script
├── requirements.txt    # Python dependencies
├── README.md          # Comprehensive documentation
├── my-server.py       # Original starter code
└── my-calls.py        # Original starter code
```

## How to Run

1. **Start the server:**
   ```bash
   cd Lab_4
   python app.py
   ```

2. **Run tests:**
   ```bash
   python -m unittest test_app.py -v
   ```

3. **Run demonstration:**
   ```bash
   python demo.py
   ```

The implementation successfully demonstrates understanding of HTTP protocol concepts using Python Flask, with a robust factorization service that meets all specified requirements.