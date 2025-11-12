import React from 'react';
import './ResultsPage.css';
import {
  calculateFinalScore,
  getPerformanceMessage,
  calculateScoreByCategory,
  formatDuration
} from '../controllers/ScoreController';

/**
 * ResultsPage Component
 * Displays quiz results with detailed scoring and analysis
 */
const ResultsPage = ({ quiz, onRestart, onViewDetails }) => {
  const scoreDetails = calculateFinalScore(quiz);
  const performance = getPerformanceMessage(scoreDetails.percentage);
  const categoryScores = calculateScoreByCategory(quiz);

  return (
    <div className="results-page">
      <div className="results-container">
        {/* Trophy Animation */}
        <div className="trophy-section">
          <div className="trophy">{performance.icon}</div>
          <h1 className="results-title">Quiz Complete!</h1>
        </div>

        {/* Main Score Card */}
        <div className="score-card" style={{ borderColor: performance.color }}>
          <div className="score-main">
            <div className="score-number">{scoreDetails.correctAnswers}</div>
            <div className="score-total">/ {scoreDetails.totalQuestions}</div>
          </div>
          <div className="score-percentage" style={{ color: performance.color }}>
            {scoreDetails.percentage}%
          </div>
          <div className="score-grade">
            Grade: <span style={{ color: performance.color }}>{scoreDetails.grade}</span>
          </div>
        </div>

        {/* Performance Message */}
        <div className="performance-message" style={{ background: `${performance.color}15` }}>
          <p style={{ color: performance.color }}>{performance.message}</p>
        </div>

        {/* Statistics Grid */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">✓</div>
            <div className="stat-value">{scoreDetails.correctAnswers}</div>
            <div className="stat-label">Correct</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">✗</div>
            <div className="stat-value">{scoreDetails.incorrectAnswers}</div>
            <div className="stat-label">Incorrect</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⏱️</div>
            <div className="stat-value">{formatDuration(scoreDetails.duration)}</div>
            <div className="stat-label">Time Taken</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📊</div>
            <div className="stat-value">{scoreDetails.grade}</div>
            <div className="stat-label">Grade</div>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="category-section">
          <h3 className="section-title">Performance by Category</h3>
          <div className="category-list">
            {Object.entries(categoryScores).map(([category, data]) => (
              <div key={category} className="category-item">
                <div className="category-header">
                  <span className="category-name">{category}</span>
                  <span className="category-score">
                    {data.correct}/{data.total} ({data.percentage}%)
                  </span>
                </div>
                <div className="category-bar-container">
                  <div
                    className="category-bar-fill"
                    style={{ 
                      width: `${data.percentage}%`,
                      background: data.percentage >= 70 ? '#4CAF50' : data.percentage >= 50 ? '#FF9800' : '#F44336'
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="action-buttons">
          <button className="action-button secondary" onClick={onViewDetails}>
            View Detailed Results
          </button>
          <button className="action-button primary" onClick={onRestart}>
            Take Quiz Again
          </button>
        </div>

        {/* Share Section */}
        <div className="share-section">
          <p>Share your achievement!</p>
          <p className="share-text">
            I scored {scoreDetails.correctAnswers}/{scoreDetails.totalQuestions} ({scoreDetails.percentage}%) on the React Quiz! 🎉
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;
