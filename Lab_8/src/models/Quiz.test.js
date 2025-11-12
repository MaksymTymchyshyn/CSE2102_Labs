import { Quiz } from './Quiz';
import { Question } from './Question';

describe('Quiz Model', () => {
  let questions;
  let quiz;

  beforeEach(() => {
    questions = [
      new Question(1, 'Q1?', ['A', 'B', 'C', 'D'], 0, 'Category1'),
      new Question(2, 'Q2?', ['A', 'B', 'C', 'D'], 2, 'Category1'),
      new Question(3, 'Q3?', ['A', 'B', 'C', 'D'], 1, 'Category2')
    ];
    quiz = new Quiz(questions);
  });

  describe('Constructor', () => {
    test('should initialize with empty quiz', () => {
      const emptyQuiz = new Quiz();
      expect(emptyQuiz.questions).toHaveLength(0);
      expect(emptyQuiz.currentQuestionIndex).toBe(0);
      expect(emptyQuiz.completed).toBe(false);
      expect(emptyQuiz.userAnswers.size).toBe(0);
    });

    test('should initialize with questions', () => {
      expect(quiz.questions).toHaveLength(3);
      expect(quiz.currentQuestionIndex).toBe(0);
      expect(quiz.startTime).toBeDefined();
    });
  });

  describe('getCurrentQuestion', () => {
    test('should return first question initially', () => {
      const current = quiz.getCurrentQuestion();
      expect(current.id).toBe(1);
      expect(current.text).toBe('Q1?');
    });

    test('should return null when no questions', () => {
      const emptyQuiz = new Quiz([]);
      expect(emptyQuiz.getCurrentQuestion()).toBeNull();
    });

    test('should return null when past last question', () => {
      quiz.currentQuestionIndex = 10;
      expect(quiz.getCurrentQuestion()).toBeNull();
    });
  });

  describe('submitAnswer', () => {
    test('should store user answer', () => {
      quiz.submitAnswer(0);
      expect(quiz.userAnswers.get(1)).toBe(0);
    });

    test('should update answer if resubmitted', () => {
      quiz.submitAnswer(0);
      quiz.submitAnswer(2);
      expect(quiz.userAnswers.get(1)).toBe(2);
    });

    test('should not error on invalid question', () => {
      quiz.currentQuestionIndex = 10;
      expect(() => quiz.submitAnswer(0)).not.toThrow();
    });
  });

  describe('nextQuestion', () => {
    test('should move to next question', () => {
      const result = quiz.nextQuestion();
      expect(result).toBe(true);
      expect(quiz.currentQuestionIndex).toBe(1);
      expect(quiz.completed).toBe(false);
    });

    test('should mark as completed at end', () => {
      quiz.nextQuestion(); // Move to Q2
      quiz.nextQuestion(); // Move to Q3
      const result = quiz.nextQuestion(); // Try to go past Q3
      expect(result).toBe(false);
      expect(quiz.completed).toBe(true);
      expect(quiz.endTime).toBeDefined();
    });
  });

  describe('previousQuestion', () => {
    test('should move to previous question', () => {
      quiz.nextQuestion();
      const result = quiz.previousQuestion();
      expect(result).toBe(true);
      expect(quiz.currentQuestionIndex).toBe(0);
    });

    test('should not go before first question', () => {
      const result = quiz.previousQuestion();
      expect(result).toBe(false);
      expect(quiz.currentQuestionIndex).toBe(0);
    });
  });

  describe('calculateScore', () => {
    test('should calculate correct score', () => {
      quiz.submitAnswer(0); // Correct
      quiz.nextQuestion();
      quiz.submitAnswer(2); // Correct
      quiz.nextQuestion();
      quiz.submitAnswer(1); // Correct
      
      expect(quiz.calculateScore()).toBe(3);
    });

    test('should handle mixed correct/incorrect', () => {
      quiz.submitAnswer(0); // Correct
      quiz.nextQuestion();
      quiz.submitAnswer(0); // Incorrect (correct is 2)
      quiz.nextQuestion();
      quiz.submitAnswer(1); // Correct
      
      expect(quiz.calculateScore()).toBe(2);
    });

    test('should return 0 for no answers', () => {
      expect(quiz.calculateScore()).toBe(0);
    });
  });

  describe('getPercentageScore', () => {
    test('should calculate percentage correctly', () => {
      quiz.submitAnswer(0); // Correct
      quiz.nextQuestion();
      quiz.submitAnswer(2); // Correct
      
      const percentage = quiz.getPercentageScore();
      expect(percentage).toBeCloseTo(66.67, 1);
    });

    test('should return 0 for empty quiz', () => {
      const emptyQuiz = new Quiz([]);
      expect(emptyQuiz.getPercentageScore()).toBe(0);
    });

    test('should return 100 for all correct', () => {
      quiz.submitAnswer(0);
      quiz.nextQuestion();
      quiz.submitAnswer(2);
      quiz.nextQuestion();
      quiz.submitAnswer(1);
      
      expect(quiz.getPercentageScore()).toBe(100);
    });
  });

  describe('getTotalQuestions', () => {
    test('should return correct total', () => {
      expect(quiz.getTotalQuestions()).toBe(3);
    });

    test('should return 0 for empty quiz', () => {
      const emptyQuiz = new Quiz();
      expect(emptyQuiz.getTotalQuestions()).toBe(0);
    });
  });

  describe('isQuestionAnswered', () => {
    test('should return true if answered', () => {
      quiz.submitAnswer(0);
      expect(quiz.isQuestionAnswered(1)).toBe(true);
    });

    test('should return false if not answered', () => {
      expect(quiz.isQuestionAnswered(1)).toBe(false);
    });
  });

  describe('getUserAnswer', () => {
    test('should return user answer', () => {
      quiz.submitAnswer(2);
      expect(quiz.getUserAnswer(1)).toBe(2);
    });

    test('should return undefined if not answered', () => {
      expect(quiz.getUserAnswer(1)).toBeUndefined();
    });
  });

  describe('getDuration', () => {
    test('should calculate duration', () => {
      const duration = quiz.getDuration();
      expect(duration).toBeGreaterThanOrEqual(0);
      expect(typeof duration).toBe('number');
    });

    test('should use endTime if completed', () => {
      quiz.completed = true;
      quiz.endTime = quiz.startTime + 5000; // 5 seconds
      expect(quiz.getDuration()).toBe(5);
    });
  });

  describe('getDetailedResults', () => {
    test('should return detailed results for all questions', () => {
      quiz.submitAnswer(0);
      quiz.nextQuestion();
      quiz.submitAnswer(0);
      
      const results = quiz.getDetailedResults();
      expect(results).toHaveLength(3);
      expect(results[0].questionId).toBe(1);
      expect(results[0].isCorrect).toBe(true);
      expect(results[1].isCorrect).toBe(false);
      expect(results[2].answered).toBe(false);
    });
  });

  describe('reset', () => {
    test('should reset quiz to initial state', () => {
      quiz.submitAnswer(0);
      quiz.nextQuestion();
      quiz.completed = true;
      
      quiz.reset();
      
      expect(quiz.currentQuestionIndex).toBe(0);
      expect(quiz.userAnswers.size).toBe(0);
      expect(quiz.completed).toBe(false);
      expect(quiz.endTime).toBeNull();
    });
  });
});
