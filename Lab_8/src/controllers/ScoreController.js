/**
 * Score Controller
 * Handles all scoring-related logic and calculations
 * Refactored from the main quiz component for better separation of concerns
 */

/**
 * Calculate the final score from quiz data
 * @param {Quiz} quiz - The quiz object
 * @returns {Object} Score details including total, correct, percentage
 */
export const calculateFinalScore = (quiz) => {
  if (!quiz) {
    return {
      totalQuestions: 0,
      correctAnswers: 0,
      incorrectAnswers: 0,
      percentage: 0,
      grade: 'N/A'
    };
  }

  const totalQuestions = quiz.getTotalQuestions();
  const correctAnswers = quiz.calculateScore();
  const incorrectAnswers = totalQuestions - correctAnswers;
  const percentage = quiz.getPercentageScore();
  const grade = calculateGrade(percentage);

  return {
    totalQuestions,
    correctAnswers,
    incorrectAnswers,
    percentage: Math.round(percentage * 10) / 10, // Round to 1 decimal
    grade,
    duration: quiz.getDuration()
  };
};

/**
 * Calculate letter grade based on percentage
 * @param {number} percentage - The percentage score
 * @returns {string} Letter grade
 */
export const calculateGrade = (percentage) => {
  if (percentage >= 90) return 'A';
  if (percentage >= 80) return 'B';
  if (percentage >= 70) return 'C';
  if (percentage >= 60) return 'D';
  return 'F';
};

/**
 * Get performance message based on score
 * @param {number} percentage - The percentage score
 * @returns {Object} Performance message and icon
 */
export const getPerformanceMessage = (percentage) => {
  if (percentage >= 90) {
    return {
      message: 'Outstanding! You have excellent knowledge!',
      icon: '🌟',
      color: '#4CAF50'
    };
  } else if (percentage >= 80) {
    return {
      message: 'Great job! You did very well!',
      icon: '🎉',
      color: '#2196F3'
    };
  } else if (percentage >= 70) {
    return {
      message: 'Good work! Keep practicing!',
      icon: '👍',
      color: '#FF9800'
    };
  } else if (percentage >= 60) {
    return {
      message: 'Not bad, but there\'s room for improvement.',
      icon: '📚',
      color: '#FF5722'
    };
  } else {
    return {
      message: 'Keep learning and try again!',
      icon: '💪',
      color: '#F44336'
    };
  }
};

/**
 * Calculate score by category
 * @param {Quiz} quiz - The quiz object
 * @returns {Object} Score breakdown by category
 */
export const calculateScoreByCategory = (quiz) => {
  const categoryScores = {};
  
  quiz.questions.forEach(question => {
    const category = question.category || 'General';
    const userAnswer = quiz.getUserAnswer(question.id);
    const isCorrect = userAnswer !== undefined && question.isCorrect(userAnswer);
    
    if (!categoryScores[category]) {
      categoryScores[category] = {
        total: 0,
        correct: 0,
        percentage: 0
      };
    }
    
    categoryScores[category].total++;
    if (isCorrect) {
      categoryScores[category].correct++;
    }
  });
  
  // Calculate percentages
  Object.keys(categoryScores).forEach(category => {
    const data = categoryScores[category];
    data.percentage = Math.round((data.correct / data.total) * 100);
  });
  
  return categoryScores;
};

/**
 * Format duration from seconds to readable format
 * @param {number} seconds - Duration in seconds
 * @returns {string} Formatted duration
 */
export const formatDuration = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  
  if (minutes === 0) {
    return `${remainingSeconds} second${remainingSeconds !== 1 ? 's' : ''}`;
  }
  
  return `${minutes} minute${minutes !== 1 ? 's' : ''} ${remainingSeconds} second${remainingSeconds !== 1 ? 's' : ''}`;
};

/**
 * Export score data for download
 * @param {Quiz} quiz - The quiz object
 * @param {string} userName - Name of the user
 * @returns {Object} Exportable score data
 */
export const exportScoreData = (quiz, userName = 'Anonymous') => {
  const scoreDetails = calculateFinalScore(quiz);
  const categoryScores = calculateScoreByCategory(quiz);
  const detailedResults = quiz.getDetailedResults();
  
  return {
    userName,
    timestamp: new Date().toISOString(),
    score: scoreDetails,
    categoryScores,
    detailedResults
  };
};

export default {
  calculateFinalScore,
  calculateGrade,
  getPerformanceMessage,
  calculateScoreByCategory,
  formatDuration,
  exportScoreData
};
