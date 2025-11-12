package com.example.quiz;

import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Service to manage quiz instances for multiple users.
 * Each user gets their own quiz instance tracked by a unique quizId.
 */
@Service
public class QuizService {
    
    // Store active quizzes for multiple users
    private final Map<String, Quiz> activeQuizzes = new ConcurrentHashMap<>();
    
    // Sample questions (in a real application, these would come from a database)
    private final List<Question> questionBank;

    public QuizService() {
        questionBank = initializeQuestionBank();
    }

    /**
     * Initialize the question bank with sample questions
     * @return List of questions
     */
    private List<Question> initializeQuestionBank() {
        List<Question> questions = new ArrayList<>();
        
        questions.add(new Question(1, 
            "What does JVM stand for?",
            Arrays.asList("Java Virtual Machine", "Java Variable Method", "Java Version Manager", "Java Visual Mode"),
            0));
        
        questions.add(new Question(2,
            "Which keyword is used for inheritance in Java?",
            Arrays.asList("implements", "inherits", "extends", "derive"),
            2));
        
        questions.add(new Question(3,
            "What is the default value of a boolean variable in Java?",
            Arrays.asList("true", "false", "0", "null"),
            1));
        
        questions.add(new Question(4,
            "Which collection allows duplicate elements?",
            Arrays.asList("Set", "List", "Map", "Queue"),
            1));
        
        questions.add(new Question(5,
            "What is encapsulation in OOP?",
            Arrays.asList("Hiding implementation details", "Multiple inheritance", "Method overloading", "Interface implementation"),
            0));
        
        questions.add(new Question(6,
            "Which access modifier provides the most restricted access?",
            Arrays.asList("public", "protected", "default", "private"),
            3));
        
        questions.add(new Question(7,
            "What is polymorphism?",
            Arrays.asList("Single form", "Many forms", "No form", "Two forms"),
            1));
        
        questions.add(new Question(8,
            "Which loop is guaranteed to execute at least once?",
            Arrays.asList("for", "while", "do-while", "foreach"),
            2));
        
        questions.add(new Question(9,
            "What does API stand for?",
            Arrays.asList("Application Programming Interface", "Advanced Programming Interface", "Application Protocol Interface", "Automated Programming Interface"),
            0));
        
        questions.add(new Question(10,
            "Which design pattern ensures a class has only one instance?",
            Arrays.asList("Factory", "Singleton", "Observer", "Strategy"),
            1));
        
        return questions;
    }

    /**
     * Create a new quiz for a user
     * @param userName the name of the user taking the quiz
     * @return the unique quiz ID
     */
    public String createQuiz(String userName) {
        String quizId = UUID.randomUUID().toString();
        Quiz quiz = new Quiz(quizId, userName, new ArrayList<>(questionBank));
        activeQuizzes.put(quizId, quiz);
        return quizId;
    }

    /**
     * Get a quiz by ID
     * @param quizId the unique quiz ID
     * @return the Quiz object or null if not found
     */
    public Quiz getQuiz(String quizId) {
        return activeQuizzes.get(quizId);
    }

    /**
     * Submit an answer for a question in a quiz
     * @param quizId the unique quiz ID
     * @param questionId the question ID
     * @param answerIndex the selected answer index
     * @return true if submission was successful
     */
    public boolean submitAnswer(String quizId, int questionId, int answerIndex) {
        Quiz quiz = activeQuizzes.get(quizId);
        if (quiz != null && !quiz.isCompleted()) {
            quiz.submitAnswer(questionId, answerIndex);
            return true;
        }
        return false;
    }

    /**
     * Move to the next question in the quiz
     * @param quizId the unique quiz ID
     * @return true if moved to next question, false if quiz is complete
     */
    public boolean nextQuestion(String quizId) {
        Quiz quiz = activeQuizzes.get(quizId);
        if (quiz != null) {
            return quiz.nextQuestion();
        }
        return false;
    }

    /**
     * Complete a quiz and calculate the final score
     * @param quizId the unique quiz ID
     * @return the Quiz object with calculated score, or null if not found
     */
    public Quiz completeQuiz(String quizId) {
        Quiz quiz = activeQuizzes.get(quizId);
        if (quiz != null) {
            quiz.setCompleted(true);
        }
        return quiz;
    }

    /**
     * Delete a quiz (cleanup)
     * @param quizId the unique quiz ID
     */
    public void deleteQuiz(String quizId) {
        activeQuizzes.remove(quizId);
    }

    /**
     * Get all active quizzes (for testing/admin purposes)
     * @return Map of all active quizzes
     */
    public Map<String, Quiz> getAllActiveQuizzes() {
        return new HashMap<>(activeQuizzes);
    }
}
