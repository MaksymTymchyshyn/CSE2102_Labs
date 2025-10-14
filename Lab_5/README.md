# Lab 5: Basic HTTP with Python Flask and Pub-Sub Endpoints

## Overview

This lab implements a basic HTTP server using Python Flask that provides a publish-subscribe pattern. The server manages subscribers and allows publishing subjects that notify all registered subscribers.

## Features

- **Subscriber Management**: Add, delete, and list subscribers
- **Publishing**: Publish subjects and notify all subscribers
- **HTTP REST API**: All operations available through HTTP endpoints
- **In-memory Storage**: Subscribers stored in server memory
- **Comprehensive Testing**: Full unit test coverage
- **Logging**: Detailed logging and console notifications

## API Endpoints

### 1. Add Subscriber
- **Method**: `POST /subscribers`
- **Body**: JSON with `name` and `url` fields
- **Response**: 201 on success, 400/409 on error

### 2. Delete Subscriber
- **Method**: `DELETE /subscribers/<name>`
- **Response**: 200 on success, 404 if not found

### 3. List Subscribers
- **Method**: `GET /subscribers`
- **Response**: JSON object with all subscribers and their URLs

### 4. Publish Subject
- **Method**: `POST /publish`
- **Body**: JSON with `subject` field
- **Response**: 200 with notification details

### 5. Get Current Subject
- **Method**: `GET /subject`
- **Response**: JSON with current published subject

### 6. Health Check
- **Method**: `GET /`
- **Response**: Server status and statistics

## Installation and Setup

1. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

2. **Run the Server**:
   ```bash
   python app.py
   ```
   The server will start on `http://localhost:5000`

3. **Run Tests**:
   ```bash
   pytest test_app.py -v
   ```

## Usage Examples with curl

### Add Subscribers
```bash
# Add first subscriber
curl -X POST http://localhost:5000/subscribers \
  -H "Content-Type: application/json" \
  -d '{"name": "alice", "url": "http://alice.com/webhook"}'

# Add second subscriber
curl -X POST http://localhost:5000/subscribers \
  -H "Content-Type: application/json" \
  -d '{"name": "bob", "url": "http://bob.com/webhook"}'
```

### List Subscribers
```bash
curl -X GET http://localhost:5000/subscribers
```

### Publish a Subject
```bash
curl -X POST http://localhost:5000/publish \
  -H "Content-Type: application/json" \
  -d '{"subject": "Important News Update"}'
```

### Delete a Subscriber
```bash
curl -X DELETE http://localhost:5000/subscribers/alice
```

### Check Server Status
```bash
curl -X GET http://localhost:5000/
```

## Testing

The project includes comprehensive unit tests covering:
- Adding subscribers (success, duplicate, missing data)
- Deleting subscribers (success, not found)
- Listing subscribers (empty, with data)
- Publishing subjects (with/without subscribers, missing data)
- Integration workflow testing
- Error handling

Run tests with:
```bash
pytest test_app.py -v
```

## Project Structure

```
Lab_5/
├── app.py              # Main Flask application
├── test_app.py         # Unit tests
├── requirements.txt    # Python dependencies
├── README.md          # This file
├── IMPLEMENTATION_SUMMARY.md  # Implementation details
└── demo.sh            # Demo script
```

## Demo Script

A demo script (`demo.sh`) is provided to demonstrate all functionality:
```bash
chmod +x demo.sh
./demo.sh
```

## Implementation Notes

- **In-memory Storage**: Subscribers are stored in a Python dictionary
- **Thread Safety**: Current implementation is suitable for single-threaded development
- **Notifications**: Print statements show subscriber notifications as specified
- **Error Handling**: Proper HTTP status codes and error messages
- **Logging**: Both file logging and console output for debugging

## Requirements Fulfilled

✅ All subscribers stored in HTTP server  
✅ Endpoint for adding subscribers (name + URL)  
✅ Endpoint for deleting subscribers (by name)  
✅ Endpoint for listing subscribers and URLs  
✅ Endpoint for publishing and notifying subscribers  
✅ Backend notifications via print statements  
✅ Separate terminal testing capability  
✅ Unit tests included  
✅ README with run instructions  