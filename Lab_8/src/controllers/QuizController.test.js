import {
  initializeQuiz,
  submitAnswer,
  goToNextQuestion,
  goToPreviousQuestion,
  getQuizProgress,
  canProceed,
  validateQuizCompletion,
  getQuizSummary,
  resetQuiz
} from './QuizController';

describe('QuizController', () => {
  let quiz;
  const testQuizData = [
    { id: 1, text: 'Q1?', options: ['A', 'B', 'C', 'D'], correctAnswerIndex: 0, category: 'Test' },
    { id: 2, text: 'Q2?', options: ['A', 'B', 'C', 'D'], correctAnswerIndex: 2, category: 'Test' },
    { id: 3, text: 'Q3?', options: ['A', 'B', 'C', 'D'], correctAnswerIndex: 1, category: 'Test' }
  ];

  beforeEach(() => {
    quiz = initializeQuiz(testQuizData);
  });

  describe('initializeQuiz', () => {
    test('should initialize quiz with questions', () => {
      expect(quiz).toBeDefined();
      expect(quiz.getTotalQuestions()).toBeGreaterThan(0);
      expect(quiz.currentQuestionIndex).toBe(0);
      expect(quiz.completed).toBe(false);
    });

    test('should initialize with custom questions', () => {
      const customQuestions = [
        { id: 1, text: 'Q1?', options: ['A', 'B'], correctAnswerIndex: 0, category: 'Test' }
      ];
      const customQuiz = initializeQuiz(customQuestions);
      expect(customQuiz.getTotalQuestions()).toBe(1);
    });

    test('should handle empty questions array', () => {
      const emptyQuiz = initializeQuiz([]);
      expect(emptyQuiz.getTotalQuestions()).toBe(0);
    });
  });

  describe('submitAnswer', () => {
    test('should submit answer successfully', () => {
      const result = submitAnswer(quiz, 0);
      expect(result.success).toBe(true);
      expect(result.questionId).toBeDefined();
    });

    test('should store user answer', () => {
      submitAnswer(quiz, 2);
      const currentQuestion = quiz.getCurrentQuestion();
      expect(quiz.getUserAnswer(currentQuestion.id)).toBe(2);
    });

    test('should allow answer change', () => {
      submitAnswer(quiz, 0);
      submitAnswer(quiz, 1);
      const currentQuestion = quiz.getCurrentQuestion();
      expect(quiz.getUserAnswer(currentQuestion.id)).toBe(1);
    });
  });

  describe('goToNextQuestion', () => {
    test('should move to next question', () => {
      const result = goToNextQuestion(quiz);
      expect(result.success).toBe(true);
      expect(quiz.currentQuestionIndex).toBe(1);
    });

    test('should complete quiz at end', () => {
      // Move through all questions
      for (let i = 0; i < quiz.getTotalQuestions(); i++) {
        goToNextQuestion(quiz);
      }
      expect(quiz.completed).toBe(true);
    });

    test('should not go past last question', () => {
      // Move to end
      for (let i = 0; i < quiz.getTotalQuestions() + 5; i++) {
        goToNextQuestion(quiz);
      }
      expect(quiz.currentQuestionIndex).toBeLessThan(quiz.getTotalQuestions() + 1);
    });
  });

  describe('goToPreviousQuestion', () => {
    test('should move to previous question', () => {
      goToNextQuestion(quiz);
      goToNextQuestion(quiz);
      const result = goToPreviousQuestion(quiz);
      expect(result.success).toBe(true);
      expect(quiz.currentQuestionIndex).toBe(1);
    });

    test('should not go before first question', () => {
      const result = goToPreviousQuestion(quiz);
      expect(result.success).toBe(false);
      expect(quiz.currentQuestionIndex).toBe(0);
    });

    test('should work after completing quiz', () => {
      // Complete quiz
      for (let i = 0; i < quiz.getTotalQuestions(); i++) {
        goToNextQuestion(quiz);
      }
      // Go back
      const result = goToPreviousQuestion(quiz);
      expect(result.success).toBe(true);
    });
  });

  describe('getQuizProgress', () => {
    test('should calculate progress correctly', () => {
      const progress = getQuizProgress(quiz);
      expect(progress.current).toBe(1);
      expect(progress.total).toBe(quiz.getTotalQuestions());
      expect(progress.percentage).toBe(0);
    });

    test('should update after answering', () => {
      submitAnswer(quiz, 0);
      goToNextQuestion(quiz);
      const progress = getQuizProgress(quiz);
      expect(progress.current).toBe(2);
      expect(progress.answered).toBe(1);
    });

    test('should reach 100% at end', () => {
      // Answer all questions
      for (let i = 0; i < quiz.getTotalQuestions(); i++) {
        submitAnswer(quiz, 0);
        goToNextQuestion(quiz);
      }
      const progress = getQuizProgress(quiz);
      expect(progress.percentage).toBe(100);
    });
  });

  describe('canProceed', () => {
    test('should return false if current question not answered', () => {
      expect(canProceed(quiz)).toBe(false);
    });

    test('should return true if current question answered', () => {
      submitAnswer(quiz, 0);
      expect(canProceed(quiz)).toBe(true);
    });

    test('should return true at last question', () => {
      // Move to last question
      for (let i = 0; i < quiz.getTotalQuestions() - 1; i++) {
        submitAnswer(quiz, 0);
        goToNextQuestion(quiz);
      }
      submitAnswer(quiz, 0);
      expect(canProceed(quiz)).toBe(true);
    });
  });

  describe('validateQuizCompletion', () => {
    test('should return false if not all answered', () => {
      submitAnswer(quiz, 0);
      const validation = validateQuizCompletion(quiz);
      expect(validation.isComplete).toBe(false);
      expect(validation.unansweredQuestions).toBeGreaterThan(0);
    });

    test('should return true if all answered', () => {
      // Answer all questions
      for (let i = 0; i < quiz.getTotalQuestions(); i++) {
        submitAnswer(quiz, 0);
        goToNextQuestion(quiz);
      }
      const validation = validateQuizCompletion(quiz);
      expect(validation.isComplete).toBe(true);
      expect(validation.unansweredQuestions).toBe(0);
    });
  });

  describe('getQuizSummary', () => {
    test('should return complete summary', () => {
      submitAnswer(quiz, 0);
      goToNextQuestion(quiz);
      submitAnswer(quiz, 1);
      
      const summary = getQuizSummary(quiz);
      expect(summary.totalQuestions).toBe(quiz.getTotalQuestions());
      expect(summary.answeredQuestions).toBe(2);
      expect(summary.currentQuestion).toBe(2);
      expect(summary.isCompleted).toBe(false);
    });

    test('should show completion status', () => {
      // Complete quiz
      for (let i = 0; i < quiz.getTotalQuestions(); i++) {
        submitAnswer(quiz, 0);
        goToNextQuestion(quiz);
      }
      const summary = getQuizSummary(quiz);
      expect(summary.isCompleted).toBe(true);
    });
  });

  describe('resetQuiz', () => {
    test('should reset quiz to initial state', () => {
      // Take quiz
      submitAnswer(quiz, 0);
      goToNextQuestion(quiz);
      submitAnswer(quiz, 1);
      
      // Reset
      resetQuiz(quiz);
      
      expect(quiz.currentQuestionIndex).toBe(0);
      expect(quiz.userAnswers.size).toBe(0);
      expect(quiz.completed).toBe(false);
    });

    test('should reset completed quiz', () => {
      // Complete quiz
      for (let i = 0; i < quiz.getTotalQuestions(); i++) {
        submitAnswer(quiz, 0);
        goToNextQuestion(quiz);
      }
      
      resetQuiz(quiz);
      expect(quiz.completed).toBe(false);
      expect(quiz.currentQuestionIndex).toBe(0);
    });
  });

  describe('Integration Tests', () => {
    test('should handle complete quiz flow', () => {
      // Take quiz
      expect(canProceed(quiz)).toBe(false);
      
      submitAnswer(quiz, 0);
      expect(canProceed(quiz)).toBe(true);
      
      goToNextQuestion(quiz);
      expect(quiz.currentQuestionIndex).toBe(1);
      
      submitAnswer(quiz, 1);
      goToPreviousQuestion(quiz);
      expect(quiz.currentQuestionIndex).toBe(0);
      
      goToNextQuestion(quiz);
      const progress = getQuizProgress(quiz);
      expect(progress.answered).toBe(2);
    });

    test('should handle quiz completion flow', () => {
      // Answer all
      for (let i = 0; i < quiz.getTotalQuestions(); i++) {
        submitAnswer(quiz, 0);
        goToNextQuestion(quiz);
      }
      
      const validation = validateQuizCompletion(quiz);
      expect(validation.isComplete).toBe(true);
      
      const summary = getQuizSummary(quiz);
      expect(summary.isCompleted).toBe(true);
      
      // Reset and verify
      resetQuiz(quiz);
      expect(quiz.completed).toBe(false);
    });
  });
});
