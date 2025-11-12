import { Question } from '../models/Question';
import { Quiz } from '../models/Quiz';

/**
 * Quiz Controller
 * Manages quiz flow, question navigation, and state
 * Refactored from the main quiz component for better separation of concerns
 */

/**
 * Initialize a new quiz with questions
 * @param {Array} questionsData - Array of question data objects
 * @returns {Quiz} New quiz instance
 */
export const initializeQuiz = (questionsData) => {
  const questions = questionsData.map(q => 
    new Question(q.id, q.text, q.options, q.correctAnswerIndex, q.category)
  );
  return new Quiz(questions);
};

/**
 * Handle answer submission for current question
 * @param {Quiz} quiz - The quiz instance
 * @param {number} answerIndex - Selected answer index
 * @returns {Quiz} Updated quiz instance
 */
export const submitAnswer = (quiz, answerIndex) => {
  if (!quiz) return null;
  quiz.submitAnswer(answerIndex);
  return quiz;
};

/**
 * Navigate to next question
 * @param {Quiz} quiz - The quiz instance
 * @returns {Object} Navigation result with success status and completion flag
 */
export const goToNextQuestion = (quiz) => {
  if (!quiz) return { success: false, completed: false };
  
  const hasNext = quiz.nextQuestion();
  return {
    success: true,
    completed: !hasNext,
    currentIndex: quiz.currentQuestionIndex
  };
};

/**
 * Navigate to previous question
 * @param {Quiz} quiz - The quiz instance
 * @returns {Object} Navigation result with success status
 */
export const goToPreviousQuestion = (quiz) => {
  if (!quiz) return { success: false };
  
  const hasPrevious = quiz.previousQuestion();
  return {
    success: hasPrevious,
    currentIndex: quiz.currentQuestionIndex
  };
};

/**
 * Get current quiz progress
 * @param {Quiz} quiz - The quiz instance
 * @returns {Object} Progress information
 */
export const getQuizProgress = (quiz) => {
  if (!quiz) {
    return {
      currentQuestion: 0,
      totalQuestions: 0,
      percentage: 0,
      answeredCount: 0
    };
  }

  const answeredCount = Array.from(quiz.userAnswers.keys()).length;
  const totalQuestions = quiz.getTotalQuestions();
  const percentage = totalQuestions > 0 
    ? Math.round((quiz.currentQuestionIndex / totalQuestions) * 100)
    : 0;

  return {
    currentQuestion: quiz.currentQuestionIndex + 1,
    totalQuestions,
    percentage,
    answeredCount
  };
};

/**
 * Check if quiz can proceed (current question answered)
 * @param {Quiz} quiz - The quiz instance
 * @returns {boolean} True if can proceed
 */
export const canProceed = (quiz) => {
  if (!quiz) return false;
  const currentQuestion = quiz.getCurrentQuestion();
  if (!currentQuestion) return false;
  return quiz.isQuestionAnswered(currentQuestion.id);
};

/**
 * Validate quiz completion
 * @param {Quiz} quiz - The quiz instance
 * @returns {Object} Validation result
 */
export const validateQuizCompletion = (quiz) => {
  if (!quiz) {
    return {
      isValid: false,
      message: 'No quiz data available'
    };
  }

  const totalQuestions = quiz.getTotalQuestions();
  const answeredCount = Array.from(quiz.userAnswers.keys()).length;
  
  if (answeredCount < totalQuestions) {
    return {
      isValid: false,
      message: `Please answer all questions. ${answeredCount}/${totalQuestions} answered.`,
      answeredCount,
      totalQuestions
    };
  }

  return {
    isValid: true,
    message: 'All questions answered!',
    answeredCount,
    totalQuestions
  };
};

/**
 * Get quiz summary for review
 * @param {Quiz} quiz - The quiz instance
 * @returns {Array} Summary of all questions and answers
 */
export const getQuizSummary = (quiz) => {
  if (!quiz) return [];
  return quiz.getDetailedResults();
};

/**
 * Reset quiz to start over
 * @param {Quiz} quiz - The quiz instance
 * @returns {Quiz} Reset quiz instance
 */
export const resetQuiz = (quiz) => {
  if (quiz) {
    quiz.reset();
  }
  return quiz;
};

export default {
  initializeQuiz,
  submitAnswer,
  goToNextQuestion,
  goToPreviousQuestion,
  getQuizProgress,
  canProceed,
  validateQuizCompletion,
  getQuizSummary,
  resetQuiz
};
