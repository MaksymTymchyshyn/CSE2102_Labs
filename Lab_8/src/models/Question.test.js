import { Question } from './Question';

describe('Question Model', () => {
  let question;

  beforeEach(() => {
    question = new Question(
      1,
      'What is React?',
      ['A library', 'A framework', 'A language', 'A tool'],
      0,
      'React'
    );
  });

  describe('Constructor', () => {
    test('should create a question with all properties', () => {
      expect(question.id).toBe(1);
      expect(question.text).toBe('What is React?');
      expect(question.options).toHaveLength(4);
      expect(question.correctAnswerIndex).toBe(0);
      expect(question.category).toBe('React');
    });

    test('should use default category if not provided', () => {
      const q = new Question(2, 'Test?', ['A', 'B'], 0);
      expect(q.category).toBe('General');
    });
  });

  describe('isCorrect', () => {
    test('should return true for correct answer', () => {
      expect(question.isCorrect(0)).toBe(true);
    });

    test('should return false for incorrect answer', () => {
      expect(question.isCorrect(1)).toBe(false);
      expect(question.isCorrect(2)).toBe(false);
      expect(question.isCorrect(3)).toBe(false);
    });

    test('should handle invalid indices', () => {
      expect(question.isCorrect(-1)).toBe(false);
      expect(question.isCorrect(10)).toBe(false);
    });
  });

  describe('getCorrectAnswer', () => {
    test('should return the correct answer text', () => {
      expect(question.getCorrectAnswer()).toBe('A library');
    });

    test('should return correct answer for different indices', () => {
      const q = new Question(2, 'Test?', ['Wrong', 'Wrong', 'Correct'], 2);
      expect(q.getCorrectAnswer()).toBe('Correct');
    });
  });

  describe('Edge Cases', () => {
    test('should handle empty options array', () => {
      const q = new Question(3, 'Empty?', [], 0);
      expect(q.options).toHaveLength(0);
      expect(q.getCorrectAnswer()).toBeUndefined();
    });

    test('should handle single option', () => {
      const q = new Question(4, 'Single?', ['Only'], 0);
      expect(q.isCorrect(0)).toBe(true);
      expect(q.getCorrectAnswer()).toBe('Only');
    });
  });
});
