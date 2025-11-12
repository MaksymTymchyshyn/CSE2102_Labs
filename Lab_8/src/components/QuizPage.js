import React, { useState, useEffect } from 'react';
import './QuizPage.css';
import { getQuizProgress, canProceed } from '../controllers/QuizController';

/**
 * QuizPage Component
 * Displays quiz questions and handles user interactions
 */
const QuizPage = ({ quiz, onSubmitAnswer, onNext, onPrevious, onSubmit }) => {
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const currentQuestion = quiz?.getCurrentQuestion();
  const progress = getQuizProgress(quiz);

  // Load saved answer when question changes
  useEffect(() => {
    if (currentQuestion) {
      const savedAnswer = quiz.getUserAnswer(currentQuestion.id);
      setSelectedAnswer(savedAnswer !== undefined ? savedAnswer : null);
    }
  }, [currentQuestion, quiz]);

  const handleOptionSelect = (index) => {
    setSelectedAnswer(index);
    onSubmitAnswer(index);
  };

  const handleNext = () => {
    onNext();
  };

  const handlePrevious = () => {
    onPrevious();
  };

  const isLastQuestion = progress.currentQuestion === progress.totalQuestions;
  const canGoNext = canProceed(quiz);

  if (!currentQuestion) {
    return (
      <div className="quiz-page">
        <div className="quiz-container">
          <p>No questions available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-page">
      <div className="quiz-container">
        {/* Header with progress */}
        <div className="quiz-header">
          <div className="progress-info">
            <span className="question-counter">
              Question {progress.currentQuestion} of {progress.totalQuestions}
            </span>
            <span className="answered-counter">
              Answered: {progress.answeredCount}/{progress.totalQuestions}
            </span>
          </div>
          <div className="progress-bar-container">
            <div 
              className="progress-bar-fill" 
              style={{ width: `${(progress.currentQuestion / progress.totalQuestions) * 100}%` }}
            />
          </div>
        </div>

        {/* Question Section */}
        <div className="question-section">
          <div className="category-badge">{currentQuestion.category}</div>
          <h2 className="question-text">{currentQuestion.text}</h2>
        </div>

        {/* Options Section */}
        <div className="options-section">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              className={`option-button ${selectedAnswer === index ? 'selected' : ''}`}
              onClick={() => handleOptionSelect(index)}
            >
              <span className="option-letter">
                {String.fromCharCode(65 + index)}
              </span>
              <span className="option-text">{option}</span>
              {selectedAnswer === index && (
                <span className="check-mark">✓</span>
              )}
            </button>
          ))}
        </div>

        {/* Navigation Buttons */}
        <div className="navigation-section">
          <button
            className="nav-button secondary"
            onClick={handlePrevious}
            disabled={progress.currentQuestion === 1}
          >
            ← Previous
          </button>

          {!isLastQuestion ? (
            <button
              className="nav-button primary"
              onClick={handleNext}
              disabled={!canGoNext}
            >
              Next →
            </button>
          ) : (
            <button
              className="nav-button submit"
              onClick={onSubmit}
              disabled={progress.answeredCount !== progress.totalQuestions}
            >
              Submit Quiz ✓
            </button>
          )}
        </div>

        {/* Help text */}
        {!canGoNext && (
          <div className="help-text">
            Please select an answer to continue
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizPage;
