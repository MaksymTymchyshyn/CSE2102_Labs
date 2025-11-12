import React from 'react';
import './HomePage.css';

/**
 * HomePage Component
 * Landing page for the quiz application
 */
const HomePage = ({ onStartQuiz }) => {
  return (
    <div className="home-page">
      <div className="home-container">
        <div className="home-header">
          <h1 className="home-title">
            <span className="icon">📚</span>
            Welcome to the React Quiz
          </h1>
          <p className="home-subtitle">Test Your Knowledge!</p>
        </div>

        <div className="home-content">
          <div className="info-card">
            <h3>📋 Quiz Information</h3>
            <ul>
              <li>✓ 12 multiple-choice questions</li>
              <li>✓ Covering various programming topics</li>
              <li>✓ Categories: Web Development, React, Algorithms, and more</li>
              <li>✓ Instant scoring and detailed feedback</li>
              <li>✓ Track your progress in real-time</li>
            </ul>
          </div>

          <div className="info-card">
            <h3>🎯 Topics Covered</h3>
            <div className="topics-grid">
              <div className="topic-badge">Web Development</div>
              <div className="topic-badge">React</div>
              <div className="topic-badge">Programming Concepts</div>
              <div className="topic-badge">Data Structures</div>
              <div className="topic-badge">Algorithms</div>
              <div className="topic-badge">Design Patterns</div>
            </div>
          </div>

          <div className="info-card">
            <h3>💡 How It Works</h3>
            <ol>
              <li>Click the "Start Quiz" button below</li>
              <li>Answer each question by selecting an option</li>
              <li>Navigate between questions using the buttons</li>
              <li>Submit when you've answered all questions</li>
              <li>View your score and detailed results</li>
            </ol>
          </div>

          <button className="start-button" onClick={onStartQuiz}>
            Start Quiz
            <span className="arrow">→</span>
          </button>

          <div className="home-footer">
            <p>Good luck! 🍀</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
