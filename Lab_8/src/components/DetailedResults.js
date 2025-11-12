import React from 'react';
import './DetailedResults.css';

/**
 * DetailedResults Component
 * Shows question-by-question breakdown with correct answers
 * This is the additional page required by the assignment
 */
const DetailedResults = ({ quiz, onBack, onRestart }) => {
  const detailedResults = quiz?.getDetailedResults() || [];

  return (
    <div className="detailed-results-page">
      <div className="detailed-container">
        {/* Header */}
        <div className="detailed-header">
          <h1>📝 Detailed Results</h1>
          <p>Review your answers question by question</p>
        </div>

        {/* Results List */}
        <div className="results-list">
          {detailedResults.map((result, index) => (
            <div
              key={result.questionId}
              className={`result-item ${result.isCorrect ? 'correct' : 'incorrect'}`}
            >
              {/* Question Number and Status */}
              <div className="result-header">
                <span className="question-number">Question {index + 1}</span>
                <span className={`status-badge ${result.isCorrect ? 'correct' : 'incorrect'}`}>
                  {result.isCorrect ? '✓ Correct' : '✗ Incorrect'}
                </span>
              </div>

              {/* Category */}
              <div className="result-category">{result.category}</div>

              {/* Question Text */}
              <div className="result-question">{result.questionText}</div>

              {/* Answer Information */}
              <div className="answer-section">
                <div className="answer-row">
                  <span className="answer-label">Your Answer:</span>
                  <span className={`answer-value ${result.isCorrect ? 'correct-answer' : 'wrong-answer'}`}>
                    {result.userAnswer}
                    {result.isCorrect && <span className="icon"> ✓</span>}
                    {!result.isCorrect && <span className="icon"> ✗</span>}
                  </span>
                </div>

                {!result.isCorrect && (
                  <div className="answer-row">
                    <span className="answer-label">Correct Answer:</span>
                    <span className="answer-value correct-answer">
                      {result.correctAnswer} ✓
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Summary Statistics */}
        <div className="summary-box">
          <h3>Summary</h3>
          <div className="summary-stats">
            <div className="summary-item">
              <span className="summary-label">Total Questions:</span>
              <span className="summary-value">{detailedResults.length}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Correct Answers:</span>
              <span className="summary-value correct-color">
                {detailedResults.filter(r => r.isCorrect).length}
              </span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Incorrect Answers:</span>
              <span className="summary-value incorrect-color">
                {detailedResults.filter(r => !r.isCorrect).length}
              </span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Success Rate:</span>
              <span className="summary-value">
                {Math.round((detailedResults.filter(r => r.isCorrect).length / detailedResults.length) * 100)}%
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="action-buttons">
          <button className="action-btn secondary" onClick={onBack}>
            ← Back to Results
          </button>
          <button className="action-btn primary" onClick={onRestart}>
            Take Quiz Again
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailedResults;
