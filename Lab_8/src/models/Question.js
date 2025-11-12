/**
 * Question Model
 * Represents a single quiz question with multiple choice answers
 */
export class Question {
  constructor(id, text, options, correctAnswerIndex, category = 'General') {
    this.id = id;
    this.text = text;
    this.options = options;
    this.correctAnswerIndex = correctAnswerIndex;
    this.category = category;
  }

  /**
   * Check if the given answer index is correct
   * @param {number} answerIndex - The index of the selected answer
   * @returns {boolean} True if correct, false otherwise
   */
  isCorrect(answerIndex) {
    return answerIndex === this.correctAnswerIndex;
  }

  /**
   * Get the correct answer text
   * @returns {string} The correct answer
   */
  getCorrectAnswer() {
    return this.options[this.correctAnswerIndex];
  }
}

export default Question;
