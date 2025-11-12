package com.example.quiz;

import java.util.ArrayList;
import java.util.List;

/**
 * Represents a quiz question with multiple choice answers.
 */
public class Question {
    private int id;
    private String text;
    private List<String> options;
    private int correctAnswerIndex;

    public Question() {
        this.options = new ArrayList<>();
    }

    public Question(int id, String text, List<String> options, int correctAnswerIndex) {
        this.id = id;
        this.text = text;
        this.options = options;
        this.correctAnswerIndex = correctAnswerIndex;
    }

    // Getters and Setters
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public List<String> getOptions() {
        return options;
    }

    public void setOptions(List<String> options) {
        this.options = options;
    }

    public int getCorrectAnswerIndex() {
        return correctAnswerIndex;
    }

    public void setCorrectAnswerIndex(int correctAnswerIndex) {
        this.correctAnswerIndex = correctAnswerIndex;
    }

    /**
     * Check if the given answer is correct
     * @param answerIndex the index of the answer to check
     * @return true if correct, false otherwise
     */
    public boolean isCorrect(int answerIndex) {
        return answerIndex == correctAnswerIndex;
    }
}
