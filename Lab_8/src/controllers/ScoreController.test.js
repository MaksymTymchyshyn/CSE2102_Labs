import {
  calculateFinalScore,
  calculateGrade,
  getPerformanceMessage,
  calculateScoreByCategory,
  formatDuration,
  exportScoreData
} from './ScoreController';
import { Quiz } from '../models/Quiz';
import { Question } from '../models/Question';

describe('ScoreController', () => {
  let quiz;

  beforeEach(() => {
    const questions = [
      new Question(1, 'Q1?', ['A', 'B', 'C', 'D'], 0, 'Category1'),
      new Question(2, 'Q2?', ['A', 'B', 'C', 'D'], 2, 'Category1'),
      new Question(3, 'Q3?', ['A', 'B', 'C', 'D'], 1, 'Category2'),
      new Question(4, 'Q4?', ['A', 'B', 'C', 'D'], 3, 'Category2')
    ];
    quiz = new Quiz(questions);
  });

  describe('calculateFinalScore', () => {
    test('should calculate score correctly', () => {
      quiz.submitAnswer(0); // Correct
      quiz.nextQuestion();
      quiz.submitAnswer(2); // Correct
      
      const score = calculateFinalScore(quiz);
      expect(score.correctAnswers).toBe(2);
      expect(score.incorrectAnswers).toBe(2);
      expect(score.totalQuestions).toBe(4);
      expect(score.percentage).toBe(50);
    });

    test('should handle all correct answers', () => {
      quiz.submitAnswer(0);
      quiz.nextQuestion();
      quiz.submitAnswer(2);
      quiz.nextQuestion();
      quiz.submitAnswer(1);
      quiz.nextQuestion();
      quiz.submitAnswer(3);
      
      const score = calculateFinalScore(quiz);
      expect(score.correctAnswers).toBe(4);
      expect(score.incorrectAnswers).toBe(0);
      expect(score.percentage).toBe(100);
    });

    test('should handle all incorrect answers', () => {
      quiz.submitAnswer(1); // Wrong
      quiz.nextQuestion();
      quiz.submitAnswer(0); // Wrong
      quiz.nextQuestion();
      quiz.submitAnswer(0); // Wrong
      quiz.nextQuestion();
      quiz.submitAnswer(0); // Wrong
      
      const score = calculateFinalScore(quiz);
      expect(score.correctAnswers).toBe(0);
      expect(score.incorrectAnswers).toBe(4);
      expect(score.percentage).toBe(0);
    });

    test('should handle empty quiz', () => {
      const emptyQuiz = new Quiz([]);
      const score = calculateFinalScore(emptyQuiz);
      expect(score.totalQuestions).toBe(0);
      expect(score.percentage).toBe(0);
    });
  });

  describe('calculateGrade', () => {
    test('should return A for 90-100%', () => {
      expect(calculateGrade(100)).toBe('A');
      expect(calculateGrade(95)).toBe('A');
      expect(calculateGrade(90)).toBe('A');
    });

    test('should return B for 80-89%', () => {
      expect(calculateGrade(89)).toBe('B');
      expect(calculateGrade(85)).toBe('B');
      expect(calculateGrade(80)).toBe('B');
    });

    test('should return C for 70-79%', () => {
      expect(calculateGrade(79)).toBe('C');
      expect(calculateGrade(75)).toBe('C');
      expect(calculateGrade(70)).toBe('C');
    });

    test('should return D for 60-69%', () => {
      expect(calculateGrade(69)).toBe('D');
      expect(calculateGrade(65)).toBe('D');
      expect(calculateGrade(60)).toBe('D');
    });

    test('should return F for below 60%', () => {
      expect(calculateGrade(59)).toBe('F');
      expect(calculateGrade(50)).toBe('F');
      expect(calculateGrade(0)).toBe('F');
    });

    test('should handle edge cases', () => {
      expect(calculateGrade(-1)).toBe('F');
      expect(calculateGrade(101)).toBe('A');
    });
  });

  describe('getPerformanceMessage', () => {
    test('should return excellent message for 90-100%', () => {
      const result = getPerformanceMessage(95);
      expect(result.message).toContain('excellent');
      expect(result.icon).toBeDefined();
      expect(result.color).toBeDefined();
    });

    test('should return great message for 80-89%', () => {
      const result = getPerformanceMessage(85);
      expect(result.message).toContain('Great');
      expect(result.icon).toBeDefined();
    });

    test('should return good message for 70-79%', () => {
      const result = getPerformanceMessage(75);
      expect(result.message).toContain('Good');
      expect(result.icon).toBeDefined();
    });

    test('should return pass message for 60-69%', () => {
      const result = getPerformanceMessage(65);
      expect(result.message).toContain('improvement');
      expect(result.icon).toBeDefined();
    });

    test('should return study more message for below 60%', () => {
      const result = getPerformanceMessage(50);
      expect(result.message).toContain('Keep learning');
      expect(result.icon).toBeDefined();
    });
  });

  describe('calculateScoreByCategory', () => {
    test('should calculate scores by category', () => {
      quiz.submitAnswer(0); // Category1 correct
      quiz.nextQuestion();
      quiz.submitAnswer(0); // Category1 incorrect
      quiz.nextQuestion();
      quiz.submitAnswer(1); // Category2 correct
      
      const categoryScores = calculateScoreByCategory(quiz);
      
      expect(categoryScores.Category1.correct).toBe(1);
      expect(categoryScores.Category1.total).toBe(2);
      expect(categoryScores.Category1.percentage).toBe(50);
      
      expect(categoryScores.Category2.correct).toBe(1);
      expect(categoryScores.Category2.total).toBe(2);
      expect(categoryScores.Category2.percentage).toBe(50);
    });

    test('should handle all categories', () => {
      quiz.submitAnswer(0);
      quiz.nextQuestion();
      quiz.submitAnswer(2);
      quiz.nextQuestion();
      quiz.submitAnswer(1);
      quiz.nextQuestion();
      quiz.submitAnswer(3);
      
      const categoryScores = calculateScoreByCategory(quiz);
      expect(Object.keys(categoryScores)).toHaveLength(2);
    });
  });

  describe('formatDuration', () => {
    test('should format seconds correctly', () => {
      expect(formatDuration(30)).toBe('30 seconds');
      expect(formatDuration(45)).toBe('45 seconds');
    });

    test('should format minutes and seconds', () => {
      expect(formatDuration(90)).toBe('1 minute 30 seconds');
      expect(formatDuration(125)).toBe('2 minutes 5 seconds');
    });

    test('should handle exactly one minute', () => {
      expect(formatDuration(60)).toBe('1 minute 0 seconds');
    });

    test('should handle multiple minutes', () => {
      expect(formatDuration(120)).toBe('2 minutes 0 seconds');
      expect(formatDuration(180)).toBe('3 minutes 0 seconds');
    });

    test('should handle zero seconds', () => {
      expect(formatDuration(0)).toBe('0 seconds');
    });
  });

  describe('exportScoreData', () => {
    test('should export complete score data', () => {
      quiz.submitAnswer(0);
      quiz.nextQuestion();
      quiz.submitAnswer(2);
      
      const data = exportScoreData(quiz);
      
      expect(data.score).toBeDefined();
      expect(data.score.grade).toBeDefined();
      expect(data.categoryScores).toBeDefined();
      expect(data.detailedResults).toBeDefined();
      expect(data.timestamp).toBeDefined();
    });

    test('should include all score fields', () => {
      quiz.submitAnswer(0);
      const data = exportScoreData(quiz);
      
      expect(data.score.correctAnswers).toBeDefined();
      expect(data.score.incorrectAnswers).toBeDefined();
      expect(data.score.totalQuestions).toBeDefined();
      expect(data.score.percentage).toBeDefined();
    });

    test('should include timestamp', () => {
      const data = exportScoreData(quiz);
      const timestamp = new Date(data.timestamp);
      expect(timestamp).toBeInstanceOf(Date);
      expect(timestamp.getTime()).toBeLessThanOrEqual(Date.now());
    });
  });

  describe('Integration Tests', () => {
    test('should work together for complete scoring', () => {
      // Take quiz
      quiz.submitAnswer(0);
      quiz.nextQuestion();
      quiz.submitAnswer(2);
      quiz.nextQuestion();
      quiz.submitAnswer(1);
      quiz.nextQuestion();
      quiz.submitAnswer(3);
      
      // Calculate everything
      const score = calculateFinalScore(quiz);
      const grade = calculateGrade(score.percentage);
      const message = getPerformanceMessage(score.percentage);
      const categoryScores = calculateScoreByCategory(quiz);
      const duration = formatDuration(quiz.getDuration());
      const exportData = exportScoreData(quiz);
      
      // Verify all work together
      expect(score.percentage).toBe(100);
      expect(grade).toBe('A');
      expect(message.message).toContain('Outstanding');
      expect(Object.keys(categoryScores)).toHaveLength(2);
      expect(duration).toBeDefined();
      expect(exportData.score.grade).toBe('A');
    });
  });
});
