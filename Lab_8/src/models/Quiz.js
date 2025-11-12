/**
 * Quiz Model
 * Manages quiz state, questions, and user answers
 */
export class Quiz {
  constructor(questions = []) {
    this.questions = questions;
    this.currentQuestionIndex = 0;
    this.userAnswers = new Map();
    this.completed = false;
    this.startTime = Date.now();
    this.endTime = null;
  }

  /**
   * Get the current question
   * @returns {Question|null} Current question or null if none available
   */
  getCurrentQuestion() {
    if (this.currentQuestionIndex < this.questions.length) {
      return this.questions[this.currentQuestionIndex];
    }
    return null;
  }

  /**
   * Submit an answer for the current question
   * @param {number} answerIndex - The selected answer index
   */
  submitAnswer(answerIndex) {
    const currentQuestion = this.getCurrentQuestion();
    if (currentQuestion) {
      this.userAnswers.set(currentQuestion.id, answerIndex);
    }
  }

  /**
   * Move to the next question
   * @returns {boolean} True if moved to next, false if quiz is complete
   */
  nextQuestion() {
    if (this.currentQuestionIndex < this.questions.length - 1) {
      this.currentQuestionIndex++;
      return true;
    }
    this.completed = true;
    this.endTime = Date.now();
    return false;
  }

  /**
   * Move to the previous question
   * @returns {boolean} True if moved to previous, false if at start
   */
  previousQuestion() {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
      return true;
    }
    return false;
  }

  /**
   * Calculate the total score
   * @returns {number} Number of correct answers
   */
  calculateScore() {
    let score = 0;
    this.questions.forEach(question => {
      const userAnswer = this.userAnswers.get(question.id);
      if (userAnswer !== undefined && question.isCorrect(userAnswer)) {
        score++;
      }
    });
    return score;
  }

  /**
   * Get the percentage score
   * @returns {number} Percentage score (0-100)
   */
  getPercentageScore() {
    if (this.questions.length === 0) return 0;
    return (this.calculateScore() / this.questions.length) * 100;
  }

  /**
   * Get total number of questions
   * @returns {number} Total questions
   */
  getTotalQuestions() {
    return this.questions.length;
  }

  /**
   * Check if a question has been answered
   * @param {number} questionId - The question ID
   * @returns {boolean} True if answered
   */
  isQuestionAnswered(questionId) {
    return this.userAnswers.has(questionId);
  }

  /**
   * Get the user's answer for a question
   * @param {number} questionId - The question ID
   * @returns {number|undefined} The answer index or undefined
   */
  getUserAnswer(questionId) {
    return this.userAnswers.get(questionId);
  }

  /**
   * Get quiz duration in seconds
   * @returns {number} Duration in seconds
   */
  getDuration() {
    const end = this.endTime || Date.now();
    return Math.floor((end - this.startTime) / 1000);
  }

  /**
   * Get detailed results for each question
   * @returns {Array} Array of result objects
   */
  getDetailedResults() {
    return this.questions.map(question => {
      const userAnswer = this.userAnswers.get(question.id);
      const isCorrect = userAnswer !== undefined && question.isCorrect(userAnswer);
      
      return {
        questionId: question.id,
        questionText: question.text,
        category: question.category,
        userAnswer: userAnswer !== undefined ? question.options[userAnswer] : 'Not answered',
        correctAnswer: question.getCorrectAnswer(),
        isCorrect: isCorrect,
        answered: userAnswer !== undefined
      };
    });
  }

  /**
   * Reset the quiz to start over
   */
  reset() {
    this.currentQuestionIndex = 0;
    this.userAnswers.clear();
    this.completed = false;
    this.startTime = Date.now();
    this.endTime = null;
  }
}

export default Quiz;
