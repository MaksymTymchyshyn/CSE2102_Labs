# Lab 6: REST Endpoints

## Objective
To use REST endpoints with a Spring Java system to compute:
1. The quality of passwords
2. A basic email address validity check

These functions are validated using unit tests.

## REST Endpoints Report

A report listing your REST endpoints. Include details of the endpoints. This report should include a table such as:

| Endpoint | Consumes | Returns |
|----------|----------|---------|
| password-quality | `password` (String) - Query parameter | `"strong"`, `"medium"`, or `"weak"` (String) |
| email-address-valid | `email` (String) - Query parameter | `"valid"` or `"invalid"` (String) |

## Implementation

### Endpoints

#### 1. Password Quality (`/password-quality`)
- **HTTP Method**: GET
- **Parameter**: `password` (query parameter)
- **Returns**: String indicating password strength
  - `"strong"`: At least 8 characters with uppercase, lowercase, digit, and special character
  - `"medium"`: At least 6 characters with at least 2 character types
  - `"weak"`: Everything else

**Example Usage**:
```bash
curl "http://localhost:8080/password-quality?password=StrongP@ss123"
# Returns: strong

curl "http://localhost:8080/password-quality?password=Pass123"
# Returns: medium

curl "http://localhost:8080/password-quality?password=weak"
# Returns: weak
```

#### 2. Email Address Validation (`/email-address-valid`)
- **HTTP Method**: GET
- **Parameter**: `email` (query parameter)
- **Returns**: String indicating validity
  - `"valid"`: Email follows proper format (localpart@domain.tld)
  - `"invalid"`: Email doesn't match the expected format

**Example Usage**:
```bash
curl "http://localhost:8080/email-address-valid?email=user@example.com"
# Returns: valid

curl "http://localhost:8080/email-address-valid?email=invalid-email"
# Returns: invalid
```

## Project Structure

```
demo/
├── src/
│   ├── main/
│   │   └── java/
│   │       └── com/example/demo/
│   │           ├── DemoApplication.java       # Main Spring Boot application
│   │           └── ValidationController.java  # REST controller with endpoints
│   └── test/
│       └── java/
│           └── com/example/demo/
│               └── ValidationControllerTest.java  # Unit tests
└── pom.xml  # Maven configuration
```

## How to Run

### Build and Test
```bash
cd Lab_6/demo
./mvnw clean test
```

### Run the Application
```bash
./mvnw spring-boot:run
```

The application will start on `http://localhost:8080`

### Run Tests Only
```bash
./mvnw test
```

## Test Coverage

The implementation includes comprehensive unit tests:

### Password Quality Tests:
- Strong passwords (multiple test cases)
- Medium strength passwords
- Weak passwords (short, empty, single type)

### Email Validation Tests:
- Valid emails (standard, with numbers, dots, plus signs)
- Invalid emails (missing @, no domain, no TLD, spaces, multiple @)

All tests use Spring's MockMvc framework for testing REST endpoints without starting a full server.

## Technologies Used
- Spring Boot 2.7.18
- Spring Web (for REST endpoints)
- JUnit 5 (for testing)
- Maven (build tool)
- Java 11
