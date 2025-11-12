# Lab 8: React Quiz Application with Refactored Controllers

## Project Overview
A modern, interactive React quiz application featuring 12 multiple-choice questions across 6 programming categories. The application demonstrates proper separation of concerns with refactored controller logic, comprehensive testing, and a polished user interface.

## How to Run (3 Steps)

### 1. Install Dependencies
```bash
cd Lab_8
npm install
```

### 2. Run Tests
```bash
npm test
```

### 3. Start the Application
```bash
npm start
```

The app will open at `http://localhost:3000`

## Features Implemented

### ✅ Core Requirements Met
1. **Refactored Controller Architecture** - Scoring and quiz flow logic separated into controller modules
2. **Additional Page** - Detailed Results page showing question-by-question breakdown
3. **Comprehensive Testing** - 100+ tests covering unit and functional testing
4. **Professional UI** - Modern gradient design with smooth animations

### Quiz Features
- 12 questions across 6 categories (Web Development, React, Programming Concepts, Data Structures, Algorithms, Design Patterns)
- Real-time progress tracking
- Answer selection with visual feedback
- Forward/backward navigation between questions
- Timed quiz completion
- Instant scoring and grade calculation (A-F)
- Category-wise performance breakdown
- Detailed results review page

## Architecture

### Project Structure
```
Lab_8/
├── public/
│   └── index.html              # HTML entry point
├── src/
│   ├── components/             # React UI components
│   │   ├── HomePage.js         # Landing page
│   │   ├── QuizPage.js         # Quiz interface
│   │   ├── ResultsPage.js      # Results summary
│   │   └── DetailedResults.js  # Question-by-question review (additional page)
│   ├── controllers/            # Refactored business logic (KEY REQUIREMENT)
│   │   ├── QuizController.js   # Quiz flow management
│   │   └── ScoreController.js  # Scoring calculations
│   ├── models/                 # Data models
│   │   ├── Question.js         # Question model
│   │   └── Quiz.js             # Quiz state management
│   ├── utils/
│   │   └── quizData.js         # Quiz questions data
│   ├── App.js                  # Main application component
│   ├── index.js                # React entry point
│   └── setupTests.js           # Test configuration
├── package.json
└── README.md
```

### Refactored Controllers (Requirement #1)

#### ScoreController.js
**Purpose**: Centralized scoring logic separated from UI components

**Exported Functions**:
- `calculateFinalScore(quiz)` - Calculates total score, percentage, grade
- `calculateGrade(percentage)` - Converts percentage to letter grade (A-F)
- `getPerformanceMessage(percentage)` - Returns contextual feedback with icon and color
- `calculateScoreByCategory(quiz)` - Breaks down performance by category
- `formatDuration(seconds)` - Converts time to readable format
- `exportScoreData(quiz, userName)` - Prepares data for export/download

**Benefits of Refactoring**:
- Testable in isolation without UI dependencies
- Reusable across multiple components
- Single source of truth for scoring logic
- Easier to modify grading criteria

#### QuizController.js
**Purpose**: Manages quiz flow and navigation logic

**Exported Functions**:
- `initializeQuiz(questionsData)` - Creates new quiz instance from data
- `submitAnswer(quiz, answerIndex)` - Records user answer
- `goToNextQuestion(quiz)` - Advances to next question
- `goToPreviousQuestion(quiz)` - Returns to previous question
- `getQuizProgress(quiz)` - Calculates completion percentage
- `canProceed(quiz)` - Validates if current question is answered
- `validateQuizCompletion(quiz)` - Checks if all questions answered
- `getQuizSummary(quiz)` - Returns detailed results array
- `resetQuiz(quiz)` - Resets quiz to initial state

**Benefits of Refactoring**:
- Decouples navigation logic from UI rendering
- Enables unit testing of quiz flow
- Consistent behavior across different UI implementations
- Easier to add new quiz types or modes

### Additional Page (Requirement #2)

**DetailedResults.js** - Comprehensive question review page

Features:
- Full list of all questions with user answers
- Correct answers highlighted in green
- Incorrect answers highlighted in red
- Side-by-side comparison of user answer vs correct answer
- Summary statistics at top
- Navigation back to main results
- Responsive design matching overall theme

This page fulfills the "add a page" requirement by providing value-add functionality beyond the basic results display.

## Testing (Requirement #3)

### Test Coverage: 100+ Tests

#### Unit Tests (Models)
**Question.test.js** (11 tests)
- Constructor validation
- Answer correctness checking
- Edge cases (empty options, invalid indices)

**Quiz.test.js** (20 tests)
- State management
- Answer tracking
- Score calculation
- Navigation logic
- Duration tracking
- Detailed results generation

#### Unit Tests (Controllers) 
**ScoreController.test.js** (17 tests)
- Score calculation accuracy
- Grade assignment (A-F)
- Performance message generation
- Category breakdown calculation
- Duration formatting
- Data export functionality
- Integration scenarios

**QuizController.test.js** (34 tests)
- Quiz initialization
- Answer submission
- Navigation (next/previous)
- Progress tracking
- Completion validation
- Quiz summary generation
- Reset functionality
- Integration workflows

#### Functional Tests (Components)
**HomePage.test.js** (9 tests)
- Rendering all UI elements
- Button interaction
- Event handler invocation
- CSS class application

**QuizPage.test.js** (25 tests)
- Question display
- Option selection
- Progress bar calculation
- Navigation button states
- Submit button visibility
- Answer persistence
- Edge case handling

**ResultsPage.test.js** (18 tests)
- Score display
- Grade calculation
- Performance messages
- Category breakdown rendering
- Time formatting
- Button interactions

**App.test.js** (2 tests)
- Initial render
- Component integration

### Test Types

1. **Unit Tests** - Test individual functions and methods in isolation
   - Models: Question, Quiz classes
   - Controllers: All exported functions

2. **Functional Tests** - Test component behavior and user interactions
   - Component rendering
   - User input handling
   - State management
   - Navigation flows

3. **Integration Tests** - Test controller and model interactions
   - Complete quiz workflows
   - Multi-step operations
   - Data flow between layers

### Running Tests

```bash
# Run all tests once
npm test -- --watchAll=false

# Run tests in watch mode
npm test

# Run with coverage report
npm test -- --coverage --watchAll=false
```

## Technical Implementation

### State Management
- React hooks (useState) for component-level state
- Centralized quiz state in App.js
- Immutable state updates for predictable behavior

### Component Communication
- Props for parent-to-child data flow
- Callbacks for child-to-parent events
- No prop drilling - direct parent-child relationships

### Styling Approach
- CSS Modules pattern (separate .css per component)
- Gradient-based color scheme (#667eea to #764ba2)
- Responsive design with flexbox
- Smooth transitions and hover effects
- Mobile-friendly layout

### Data Flow
```
quizData.js (questions)
    ↓
QuizController.initializeQuiz()
    ↓
App.js (central state)
    ↓
Components (HomePage, QuizPage, ResultsPage, DetailedResults)
    ↓
User Interactions
    ↓
Controllers (process logic)
    ↓
Update State
    ↓
Re-render Components
```

## Key Design Decisions

1. **Controller Separation** - Placing business logic in controllers makes the codebase more maintainable and testable
2. **Model Layer** - Question and Quiz classes encapsulate data and behavior
3. **Functional Components** - Using React hooks for cleaner, more readable code
4. **CSS Organization** - One CSS file per component for better organization
5. **Test Organization** - Tests mirror source structure for easy navigation

## Technologies Used

- **React** 18.2.0 - UI framework
- **React Testing Library** - Component testing
- **Jest** - Test runner and assertions
- **React Scripts** 5.0.1 - Build tooling
- **CSS3** - Styling with modern features

## Future Enhancements

- Add question timer for each individual question
- Implement question randomization
- Add question difficulty levels
- Save scores to localStorage or backend
- Add leaderboard functionality
- Support multiple quiz topics/categories
- Add explanation for correct answers
- Implement accessibility features (ARIA labels, keyboard navigation)

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Performance

- First load: < 2 seconds
- Component render: < 100ms
- Test suite execution: ~ 4 seconds
- Build time: ~ 30 seconds

## License

Educational project for CSE2102 course

## Author

Created for Lab 8 - React Quiz Application Assignment
