# Lab 7: Thymeleaf Quiz Server

## Project Overview

This is a Spring Boot web application that implements a quiz server using Thymeleaf templates. The application allows multiple independent quiz takers to take a 10-question multiple-choice quiz simultaneously, with each user maintaining their own quiz session.

## Features

- **Multi-user Support**: Each quiz taker gets a unique quiz session identified by a UUID
- **Thymeleaf Integration**: All views are rendered using Thymeleaf templates with Spring Boot
- **Session Management**: Each user's quiz state is maintained independently using a concurrent data structure
- **Real-time Progress**: Visual progress bar showing quiz completion status
- **Instant Results**: Immediate score calculation and feedback upon quiz completion
- **Responsive Design**: Modern, gradient-based UI that works on various screen sizes
- **Comprehensive Testing**: Full unit and integration test coverage for all components

## Technology Stack

- **Java 11**
- **Spring Boot 2.7.18**
- **Spring Web MVC**
- **Thymeleaf** (Template Engine)
- **Maven** (Build Tool)
- **JUnit 5** (Testing Framework)
- **MockMvc** (Integration Testing)

## Project Structure

```
quiz-server/
├── src/
│   ├── main/
│   │   ├── java/com/example/quiz/
│   │   │   ├── QuizApplication.java          # Main Spring Boot application
│   │   │   ├── QuizController.java           # Web controller handling HTTP requests
│   │   │   ├── QuizService.java              # Business logic and quiz management
│   │   │   ├── Quiz.java                     # Quiz model class
│   │   │   └── Question.java                 # Question model class
│   │   └── resources/
│   │       ├── templates/
│   │       │   ├── index.html                # Home page - quiz start
│   │       │   ├── question.html             # Question display page
│   │       │   ├── results.html              # Results page
│   │       │   └── error.html                # Error page
│   │       └── application.properties        # Spring Boot configuration
│   └── test/
│       └── java/com/example/quiz/
│           ├── QuestionTest.java             # Unit tests for Question model
│           ├── QuizTest.java                 # Unit tests for Quiz model
│           ├── QuizServiceTest.java          # Unit tests for QuizService
│           └── QuizControllerTest.java       # Integration tests for QuizController
└── pom.xml                                   # Maven configuration
```

## Model Classes

### Question
- Represents a single quiz question with multiple choice options
- Properties:
  - `id`: Unique identifier for the question
  - `text`: The question text
  - `options`: List of possible answers
  - `correctAnswerIndex`: Index of the correct answer
- Methods:
  - `isCorrect(int answerIndex)`: Check if an answer is correct

### Quiz
- Represents a complete quiz session for a user
- Properties:
  - `quizId`: Unique identifier for the quiz session
  - `userName`: Name of the quiz taker
  - `questions`: List of questions in the quiz
  - `userAnswers`: Map of question IDs to selected answer indices
  - `currentQuestionIndex`: Index of the current question
  - `completed`: Boolean flag indicating if quiz is complete
- Methods:
  - `getCurrentQuestion()`: Get the current question
  - `submitAnswer(int questionId, int answerIndex)`: Submit an answer
  - `nextQuestion()`: Move to next question
  - `calculateScore()`: Calculate total correct answers
  - `getPercentageScore()`: Get percentage score
  - `getTotalQuestions()`: Get total number of questions

## Service Layer

### QuizService
- Manages quiz instances for multiple users
- Uses `ConcurrentHashMap` for thread-safe operations
- Methods:
  - `createQuiz(String userName)`: Create new quiz session
  - `getQuiz(String quizId)`: Retrieve quiz by ID
  - `submitAnswer(String quizId, int questionId, int answerIndex)`: Submit answer
  - `nextQuestion(String quizId)`: Move to next question
  - `completeQuiz(String quizId)`: Mark quiz as complete
  - `deleteQuiz(String quizId)`: Remove quiz from active sessions
  - `getAllActiveQuizzes()`: Get all active quiz sessions

## Controller Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | Home page - start quiz |
| `/start` | POST | Create new quiz session |
| `/quiz/{quizId}` | GET | Display current question |
| `/quiz/{quizId}/answer` | POST | Submit answer for question |
| `/quiz/{quizId}/results` | GET | Display quiz results |

## How to Build and Run

### Prerequisites
- Java 11 or higher
- Maven 3.6 or higher

### Build the Project
```bash
cd Lab_7/quiz-server
mvn clean install
```

### Run Tests
```bash
mvn test
```

### Run the Application
```bash
mvn spring-boot:run
```

The application will start on `http://localhost:8080`

### Create Executable JAR
```bash
mvn clean package
java -jar target/quiz-server-0.0.1-SNAPSHOT.jar
```

## Testing

### Test Coverage

The project includes comprehensive test coverage:

#### Unit Tests for Models
- **QuestionTest.java** (13 tests)
  - Tests question creation, getters/setters
  - Tests answer correctness validation
  - Tests edge cases (empty text, invalid indices)

- **QuizTest.java** (29 tests)
  - Tests quiz creation and initialization
  - Tests question navigation
  - Tests answer submission
  - Tests score calculation
  - Tests completion workflow
  - Tests edge cases and error conditions

#### Service Layer Tests
- **QuizServiceTest.java** (22 tests)
  - Tests quiz creation and retrieval
  - Tests multi-user scenarios
  - Tests concurrent quiz operations
  - Tests answer submission and validation
  - Tests quiz completion flow
  - Tests cleanup operations

#### Integration Tests
- **QuizControllerTest.java** (14 tests)
  - Tests all HTTP endpoints
  - Tests request parameter validation
  - Tests view rendering
  - Tests redirect behavior
  - Tests error handling
  - Uses MockMvc for integration testing

**Total: 78 comprehensive tests**

### Running Tests
```bash
# Run all tests
mvn test

# Run specific test class
mvn test -Dtest=QuestionTest

# Run with coverage report
mvn clean test jacoco:report
```

## Usage Flow

1. **Start Quiz**
   - User visits home page at `/`
   - Enters their name
   - Clicks "Start Quiz"
   - System creates unique quiz session

2. **Take Quiz**
   - User sees one question at a time
   - Selects an answer from multiple choices
   - Clicks "Next Question" or "Complete Quiz"
   - Progress bar shows completion status

3. **View Results**
   - After last question, user is redirected to results
   - Results show:
     - Total score (correct/total)
     - Percentage score
     - Performance message based on score
     - Statistics breakdown
   - Option to take another quiz

## Multi-User Support

The application supports multiple independent quiz takers simultaneously:

- Each user gets a unique quiz ID (UUID)
- Quiz state is maintained separately for each user
- Uses `ConcurrentHashMap` for thread-safe operations
- No interference between different users' sessions
- Sessions are isolated - one user's answers don't affect others

## Design Decisions

1. **Session Management**: Used UUID-based session IDs stored in server memory
2. **Concurrency**: `ConcurrentHashMap` ensures thread-safe multi-user support
3. **MVC Pattern**: Clear separation between Model, View (Thymeleaf), and Controller
4. **Service Layer**: Business logic separated from controller for better testability
5. **No Database**: In-memory storage for simplicity (could be enhanced with database)
6. **Template Engine**: Thymeleaf provides server-side rendering with good Spring integration