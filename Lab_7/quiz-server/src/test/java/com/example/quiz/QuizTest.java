package com.example.quiz;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Unit tests for the Quiz model class.
 */
class QuizTest {

    private Quiz quiz;
    private List<Question> questions;

    @BeforeEach
    void setUp() {
        questions = Arrays.asList(
            new Question(1, "What is Java?", 
                Arrays.asList("A language", "A drink", "An island", "A framework"), 0),
            new Question(2, "What is OOP?", 
                Arrays.asList("Object Oriented Programming", "Only One Program", "Out Of Place", "Open Office Project"), 0),
            new Question(3, "What is Spring?", 
                Arrays.asList("A season", "A framework", "A tool", "A language"), 1)
        );
        
        quiz = new Quiz("quiz-123", "John Doe", questions);
    }

    @Test
    void testQuizCreation() {
        assertNotNull(quiz);
        assertEquals("quiz-123", quiz.getQuizId());
        assertEquals("John Doe", quiz.getUserName());
        assertEquals(3, quiz.getQuestions().size());
        assertEquals(0, quiz.getCurrentQuestionIndex());
        assertFalse(quiz.isCompleted());
    }

    @Test
    void testDefaultConstructor() {
        Quiz emptyQuiz = new Quiz();
        assertNotNull(emptyQuiz);
        assertNotNull(emptyQuiz.getQuestions());
        assertNotNull(emptyQuiz.getUserAnswers());
        assertEquals(0, emptyQuiz.getCurrentQuestionIndex());
        assertFalse(emptyQuiz.isCompleted());
    }

    @Test
    void testGettersAndSetters() {
        Quiz newQuiz = new Quiz();
        
        newQuiz.setQuizId("new-quiz-id");
        assertEquals("new-quiz-id", newQuiz.getQuizId());
        
        newQuiz.setUserName("Jane Doe");
        assertEquals("Jane Doe", newQuiz.getUserName());
        
        newQuiz.setQuestions(questions);
        assertEquals(3, newQuiz.getQuestions().size());
        
        newQuiz.setCurrentQuestionIndex(1);
        assertEquals(1, newQuiz.getCurrentQuestionIndex());
        
        newQuiz.setCompleted(true);
        assertTrue(newQuiz.isCompleted());
    }

    @Test
    void testGetCurrentQuestion_FirstQuestion() {
        Question current = quiz.getCurrentQuestion();
        assertNotNull(current);
        assertEquals(1, current.getId());
        assertEquals("What is Java?", current.getText());
    }

    @Test
    void testGetCurrentQuestion_AfterMoving() {
        quiz.nextQuestion();
        Question current = quiz.getCurrentQuestion();
        assertNotNull(current);
        assertEquals(2, current.getId());
        assertEquals("What is OOP?", current.getText());
    }

    @Test
    void testGetCurrentQuestion_InvalidIndex() {
        quiz.setCurrentQuestionIndex(10);
        Question current = quiz.getCurrentQuestion();
        assertNull(current);
    }

    @Test
    void testGetCurrentQuestion_NegativeIndex() {
        quiz.setCurrentQuestionIndex(-1);
        Question current = quiz.getCurrentQuestion();
        assertNull(current);
    }

    @Test
    void testSubmitAnswer() {
        quiz.submitAnswer(1, 0);
        assertEquals(1, quiz.getUserAnswers().size());
        assertEquals(0, quiz.getUserAnswers().get(1));
    }

    @Test
    void testSubmitMultipleAnswers() {
        quiz.submitAnswer(1, 0);
        quiz.submitAnswer(2, 0);
        quiz.submitAnswer(3, 1);
        
        assertEquals(3, quiz.getUserAnswers().size());
        assertEquals(0, quiz.getUserAnswers().get(1));
        assertEquals(0, quiz.getUserAnswers().get(2));
        assertEquals(1, quiz.getUserAnswers().get(3));
    }

    @Test
    void testSubmitAnswer_OverwritePrevious() {
        quiz.submitAnswer(1, 0);
        quiz.submitAnswer(1, 2);
        
        assertEquals(1, quiz.getUserAnswers().size());
        assertEquals(2, quiz.getUserAnswers().get(1));
    }

    @Test
    void testNextQuestion_Success() {
        assertTrue(quiz.nextQuestion());
        assertEquals(1, quiz.getCurrentQuestionIndex());
        assertFalse(quiz.isCompleted());
    }

    @Test
    void testNextQuestion_ToLastQuestion() {
        quiz.nextQuestion(); // Move to question 2
        assertTrue(quiz.nextQuestion()); // Move to question 3
        assertEquals(2, quiz.getCurrentQuestionIndex());
        assertFalse(quiz.isCompleted());
    }

    @Test
    void testNextQuestion_AfterLastQuestion() {
        quiz.nextQuestion(); // Move to question 2
        quiz.nextQuestion(); // Move to question 3
        assertFalse(quiz.nextQuestion()); // Try to move beyond last
        assertTrue(quiz.isCompleted());
        assertEquals(2, quiz.getCurrentQuestionIndex());
    }

    @Test
    void testCalculateScore_AllCorrect() {
        quiz.submitAnswer(1, 0);
        quiz.submitAnswer(2, 0);
        quiz.submitAnswer(3, 1);
        
        assertEquals(3, quiz.calculateScore());
    }

    @Test
    void testCalculateScore_SomeCorrect() {
        quiz.submitAnswer(1, 0); // Correct
        quiz.submitAnswer(2, 1); // Incorrect
        quiz.submitAnswer(3, 1); // Correct
        
        assertEquals(2, quiz.calculateScore());
    }

    @Test
    void testCalculateScore_NoneCorrect() {
        quiz.submitAnswer(1, 1); // Incorrect
        quiz.submitAnswer(2, 1); // Incorrect
        quiz.submitAnswer(3, 0); // Incorrect
        
        assertEquals(0, quiz.calculateScore());
    }

    @Test
    void testCalculateScore_NoAnswers() {
        assertEquals(0, quiz.calculateScore());
    }

    @Test
    void testCalculateScore_PartialAnswers() {
        quiz.submitAnswer(1, 0); // Correct
        // Question 2 not answered
        quiz.submitAnswer(3, 1); // Correct
        
        assertEquals(2, quiz.calculateScore());
    }

    @Test
    void testGetTotalQuestions() {
        assertEquals(3, quiz.getTotalQuestions());
    }

    @Test
    void testGetTotalQuestions_EmptyQuiz() {
        Quiz emptyQuiz = new Quiz("empty", "User", Arrays.asList());
        assertEquals(0, emptyQuiz.getTotalQuestions());
    }

    @Test
    void testGetPercentageScore_AllCorrect() {
        quiz.submitAnswer(1, 0);
        quiz.submitAnswer(2, 0);
        quiz.submitAnswer(3, 1);
        
        assertEquals(100.0, quiz.getPercentageScore(), 0.01);
    }

    @Test
    void testGetPercentageScore_HalfCorrect() {
        quiz.submitAnswer(1, 0); // Correct
        quiz.submitAnswer(2, 1); // Incorrect
        quiz.submitAnswer(3, 0); // Incorrect
        
        assertEquals(33.33, quiz.getPercentageScore(), 0.01);
    }

    @Test
    void testGetPercentageScore_NoneCorrect() {
        quiz.submitAnswer(1, 1);
        quiz.submitAnswer(2, 1);
        quiz.submitAnswer(3, 0);
        
        assertEquals(0.0, quiz.getPercentageScore(), 0.01);
    }

    @Test
    void testGetPercentageScore_EmptyQuiz() {
        Quiz emptyQuiz = new Quiz("empty", "User", Arrays.asList());
        assertEquals(0.0, emptyQuiz.getPercentageScore(), 0.01);
    }

    @Test
    void testQuizCompletion_WorkflowSimulation() {
        // Start quiz
        assertFalse(quiz.isCompleted());
        assertEquals(0, quiz.getCurrentQuestionIndex());
        
        // Answer question 1
        quiz.submitAnswer(1, 0);
        quiz.nextQuestion();
        assertFalse(quiz.isCompleted());
        
        // Answer question 2
        quiz.submitAnswer(2, 0);
        quiz.nextQuestion();
        assertFalse(quiz.isCompleted());
        
        // Answer question 3
        quiz.submitAnswer(3, 1);
        quiz.nextQuestion();
        assertTrue(quiz.isCompleted());
        
        // Verify score
        assertEquals(3, quiz.calculateScore());
        assertEquals(100.0, quiz.getPercentageScore(), 0.01);
    }

    @Test
    void testQuizCompletion_ManualCompletion() {
        assertFalse(quiz.isCompleted());
        quiz.setCompleted(true);
        assertTrue(quiz.isCompleted());
    }
}
