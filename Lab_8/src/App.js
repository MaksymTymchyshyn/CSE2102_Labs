import React, { useState } from 'react';
import './App.css';
import HomePage from './components/HomePage';
import QuizPage from './components/QuizPage';
import ResultsPage from './components/ResultsPage';
import DetailedResults from './components/DetailedResults';
import { initializeQuiz, submitAnswer, goToNextQuestion, goToPreviousQuestion } from './controllers/QuizController';
import quizQuestions from './utils/quizData';

/**
 * Main App Component
 * Manages application state and routing between different views
 */
function App() {
  const [currentView, setCurrentView] = useState('home'); // home, quiz, results, detailed
  const [quiz, setQuiz] = useState(null);

  // Start the quiz
  const handleStartQuiz = () => {
    const newQuiz = initializeQuiz(quizQuestions);
    setQuiz(newQuiz);
    setCurrentView('quiz');
  };

  // Handle answer submission
  const handleSubmitAnswer = (answerIndex) => {
    if (quiz) {
      submitAnswer(quiz, answerIndex);
      setQuiz({ ...quiz }); // Trigger re-render
    }
  };

  // Navigate to next question
  const handleNext = () => {
    if (quiz) {
      goToNextQuestion(quiz);
      setQuiz({ ...quiz }); // Trigger re-render
    }
  };

  // Navigate to previous question
  const handlePrevious = () => {
    if (quiz) {
      goToPreviousQuestion(quiz);
      setQuiz({ ...quiz }); // Trigger re-render
    }
  };

  // Submit quiz and show results
  const handleSubmitQuiz = () => {
    if (quiz) {
      quiz.completed = true;
      quiz.endTime = Date.now();
      setCurrentView('results');
    }
  };

  // View detailed results
  const handleViewDetails = () => {
    setCurrentView('detailed');
  };

  // Go back to main results
  const handleBackToResults = () => {
    setCurrentView('results');
  };

  // Restart quiz
  const handleRestart = () => {
    setQuiz(null);
    setCurrentView('home');
  };

  // Render appropriate view based on current state
  return (
    <div className="App">
      {currentView === 'home' && (
        <HomePage onStartQuiz={handleStartQuiz} />
      )}

      {currentView === 'quiz' && quiz && (
        <QuizPage
          quiz={quiz}
          onSubmitAnswer={handleSubmitAnswer}
          onNext={handleNext}
          onPrevious={handlePrevious}
          onSubmit={handleSubmitQuiz}
        />
      )}

      {currentView === 'results' && quiz && (
        <ResultsPage
          quiz={quiz}
          onRestart={handleRestart}
          onViewDetails={handleViewDetails}
        />
      )}

      {currentView === 'detailed' && quiz && (
        <DetailedResults
          quiz={quiz}
          onBack={handleBackToResults}
          onRestart={handleRestart}
        />
      )}
    </div>
  );
}

export default App;
