package com.example.quiz;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Represents a quiz with multiple questions and tracking for user answers.
 */
public class Quiz {
    private String quizId;
    private String userName;
    private List<Question> questions;
    private Map<Integer, Integer> userAnswers; // questionId -> answerIndex
    private int currentQuestionIndex;
    private boolean completed;

    public Quiz() {
        this.questions = new ArrayList<>();
        this.userAnswers = new HashMap<>();
        this.currentQuestionIndex = 0;
        this.completed = false;
    }

    public Quiz(String quizId, String userName, List<Question> questions) {
        this.quizId = quizId;
        this.userName = userName;
        this.questions = questions;
        this.userAnswers = new HashMap<>();
        this.currentQuestionIndex = 0;
        this.completed = false;
    }

    // Getters and Setters
    public String getQuizId() {
        return quizId;
    }

    public void setQuizId(String quizId) {
        this.quizId = quizId;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public List<Question> getQuestions() {
        return questions;
    }

    public void setQuestions(List<Question> questions) {
        this.questions = questions;
    }

    public Map<Integer, Integer> getUserAnswers() {
        return userAnswers;
    }

    public void setUserAnswers(Map<Integer, Integer> userAnswers) {
        this.userAnswers = userAnswers;
    }

    public int getCurrentQuestionIndex() {
        return currentQuestionIndex;
    }

    public void setCurrentQuestionIndex(int currentQuestionIndex) {
        this.currentQuestionIndex = currentQuestionIndex;
    }

    public boolean isCompleted() {
        return completed;
    }

    public void setCompleted(boolean completed) {
        this.completed = completed;
    }

    /**
     * Get the current question
     * @return the current Question or null if no more questions
     */
    public Question getCurrentQuestion() {
        if (currentQuestionIndex >= 0 && currentQuestionIndex < questions.size()) {
            return questions.get(currentQuestionIndex);
        }
        return null;
    }

    /**
     * Submit an answer for a question
     * @param questionId the ID of the question
     * @param answerIndex the index of the selected answer
     */
    public void submitAnswer(int questionId, int answerIndex) {
        userAnswers.put(questionId, answerIndex);
    }

    /**
     * Move to the next question
     * @return true if moved to next question, false if quiz is complete
     */
    public boolean nextQuestion() {
        if (currentQuestionIndex < questions.size() - 1) {
            currentQuestionIndex++;
            return true;
        } else {
            completed = true;
            return false;
        }
    }

    /**
     * Calculate the score based on correct answers
     * @return the number of correct answers
     */
    public int calculateScore() {
        int score = 0;
        for (Question question : questions) {
            Integer userAnswer = userAnswers.get(question.getId());
            if (userAnswer != null && question.isCorrect(userAnswer)) {
                score++;
            }
        }
        return score;
    }

    /**
     * Get the total number of questions
     * @return the total number of questions
     */
    public int getTotalQuestions() {
        return questions.size();
    }

    /**
     * Get the percentage score
     * @return the percentage score (0-100)
     */
    public double getPercentageScore() {
        if (questions.isEmpty()) {
            return 0.0;
        }
        return (calculateScore() * 100.0) / questions.size();
    }
}
