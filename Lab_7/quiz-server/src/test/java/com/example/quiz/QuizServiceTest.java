package com.example.quiz;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Unit tests for the QuizService class.
 */
class QuizServiceTest {

    private QuizService quizService;

    @BeforeEach
    void setUp() {
        quizService = new QuizService();
    }

    @Test
    void testCreateQuiz() {
        String quizId = quizService.createQuiz("John Doe");
        
        assertNotNull(quizId);
        assertFalse(quizId.isEmpty());
        
        Quiz quiz = quizService.getQuiz(quizId);
        assertNotNull(quiz);
        assertEquals("John Doe", quiz.getUserName());
        assertEquals(10, quiz.getTotalQuestions());
    }

    @Test
    void testCreateMultipleQuizzes() {
        String quizId1 = quizService.createQuiz("User 1");
        String quizId2 = quizService.createQuiz("User 2");
        String quizId3 = quizService.createQuiz("User 3");
        
        assertNotEquals(quizId1, quizId2);
        assertNotEquals(quizId2, quizId3);
        assertNotEquals(quizId1, quizId3);
        
        Quiz quiz1 = quizService.getQuiz(quizId1);
        Quiz quiz2 = quizService.getQuiz(quizId2);
        Quiz quiz3 = quizService.getQuiz(quizId3);
        
        assertEquals("User 1", quiz1.getUserName());
        assertEquals("User 2", quiz2.getUserName());
        assertEquals("User 3", quiz3.getUserName());
    }

    @Test
    void testGetQuiz_ExistingQuiz() {
        String quizId = quizService.createQuiz("Test User");
        Quiz quiz = quizService.getQuiz(quizId);
        
        assertNotNull(quiz);
        assertEquals(quizId, quiz.getQuizId());
        assertEquals("Test User", quiz.getUserName());
    }

    @Test
    void testGetQuiz_NonExistentQuiz() {
        Quiz quiz = quizService.getQuiz("non-existent-id");
        assertNull(quiz);
    }

    @Test
    void testSubmitAnswer_ValidQuiz() {
        String quizId = quizService.createQuiz("User");
        Quiz quiz = quizService.getQuiz(quizId);
        int questionId = quiz.getCurrentQuestion().getId();
        
        boolean result = quizService.submitAnswer(quizId, questionId, 0);
        
        assertTrue(result);
        assertEquals(1, quiz.getUserAnswers().size());
    }

    @Test
    void testSubmitAnswer_NonExistentQuiz() {
        boolean result = quizService.submitAnswer("invalid-id", 1, 0);
        assertFalse(result);
    }

    @Test
    void testSubmitAnswer_CompletedQuiz() {
        String quizId = quizService.createQuiz("User");
        Quiz quiz = quizService.getQuiz(quizId);
        quiz.setCompleted(true);
        
        boolean result = quizService.submitAnswer(quizId, 1, 0);
        assertFalse(result);
    }

    @Test
    void testNextQuestion_Success() {
        String quizId = quizService.createQuiz("User");
        
        boolean result = quizService.nextQuestion(quizId);
        
        assertTrue(result);
        Quiz quiz = quizService.getQuiz(quizId);
        assertEquals(1, quiz.getCurrentQuestionIndex());
    }

    @Test
    void testNextQuestion_NonExistentQuiz() {
        boolean result = quizService.nextQuestion("invalid-id");
        assertFalse(result);
    }

    @Test
    void testNextQuestion_LastQuestion() {
        String quizId = quizService.createQuiz("User");
        Quiz quiz = quizService.getQuiz(quizId);
        
        // Move to last question
        for (int i = 0; i < quiz.getTotalQuestions() - 1; i++) {
            quizService.nextQuestion(quizId);
        }
        
        // Try to move beyond last question
        boolean result = quizService.nextQuestion(quizId);
        assertFalse(result);
        assertTrue(quiz.isCompleted());
    }

    @Test
    void testCompleteQuiz() {
        String quizId = quizService.createQuiz("User");
        
        Quiz quiz = quizService.completeQuiz(quizId);
        
        assertNotNull(quiz);
        assertTrue(quiz.isCompleted());
    }

    @Test
    void testCompleteQuiz_NonExistent() {
        Quiz quiz = quizService.completeQuiz("invalid-id");
        assertNull(quiz);
    }

    @Test
    void testDeleteQuiz() {
        String quizId = quizService.createQuiz("User");
        assertNotNull(quizService.getQuiz(quizId));
        
        quizService.deleteQuiz(quizId);
        
        assertNull(quizService.getQuiz(quizId));
    }

    @Test
    void testDeleteQuiz_NonExistent() {
        // Should not throw exception
        assertDoesNotThrow(() -> quizService.deleteQuiz("invalid-id"));
    }

    @Test
    void testGetAllActiveQuizzes() {
        String quizId1 = quizService.createQuiz("User 1");
        String quizId2 = quizService.createQuiz("User 2");
        
        Map<String, Quiz> activeQuizzes = quizService.getAllActiveQuizzes();
        
        assertEquals(2, activeQuizzes.size());
        assertTrue(activeQuizzes.containsKey(quizId1));
        assertTrue(activeQuizzes.containsKey(quizId2));
    }

    @Test
    void testGetAllActiveQuizzes_Empty() {
        Map<String, Quiz> activeQuizzes = quizService.getAllActiveQuizzes();
        assertEquals(0, activeQuizzes.size());
    }

    @Test
    void testFullQuizWorkflow() {
        // Create quiz
        String quizId = quizService.createQuiz("Test User");
        Quiz quiz = quizService.getQuiz(quizId);
        assertNotNull(quiz);
        assertFalse(quiz.isCompleted());
        
        // Answer all questions
        for (int i = 0; i < quiz.getTotalQuestions(); i++) {
            Question currentQuestion = quiz.getCurrentQuestion();
            assertNotNull(currentQuestion);
            
            // Submit answer (always choose first option)
            boolean submitResult = quizService.submitAnswer(quizId, currentQuestion.getId(), 0);
            assertTrue(submitResult);
            
            // Move to next question (except for last question)
            if (i < quiz.getTotalQuestions() - 1) {
                boolean nextResult = quizService.nextQuestion(quizId);
                assertTrue(nextResult);
            }
        }
        
        // Move past last question to complete
        quizService.nextQuestion(quizId);
        
        // Verify completion
        Quiz completedQuiz = quizService.getQuiz(quizId);
        assertTrue(completedQuiz.isCompleted());
        
        // Verify all answers were recorded
        assertEquals(10, completedQuiz.getUserAnswers().size());
    }

    @Test
    void testConcurrentQuizzes() {
        // Simulate multiple users taking quizzes simultaneously
        String quizId1 = quizService.createQuiz("User 1");
        String quizId2 = quizService.createQuiz("User 2");
        
        Quiz quiz1 = quizService.getQuiz(quizId1);
        Quiz quiz2 = quizService.getQuiz(quizId2);
        
        // User 1 answers question 1
        quizService.submitAnswer(quizId1, quiz1.getCurrentQuestion().getId(), 0);
        quizService.nextQuestion(quizId1);
        
        // User 2 answers question 1
        quizService.submitAnswer(quizId2, quiz2.getCurrentQuestion().getId(), 1);
        quizService.nextQuestion(quizId2);
        
        // User 1 answers question 2
        quizService.submitAnswer(quizId1, quiz1.getCurrentQuestion().getId(), 2);
        
        // Verify they maintained separate state
        assertEquals(2, quiz1.getUserAnswers().size());
        assertEquals(1, quiz2.getUserAnswers().size());
        assertEquals(1, quiz1.getCurrentQuestionIndex());
        assertEquals(1, quiz2.getCurrentQuestionIndex());
        
        assertFalse(quiz1.isCompleted());
        assertFalse(quiz2.isCompleted());
    }

    @Test
    void testQuestionBankNotEmpty() {
        String quizId = quizService.createQuiz("User");
        Quiz quiz = quizService.getQuiz(quizId);
        
        assertTrue(quiz.getTotalQuestions() > 0);
        assertNotNull(quiz.getCurrentQuestion());
    }

    @Test
    void testQuestionBankHas10Questions() {
        String quizId = quizService.createQuiz("User");
        Quiz quiz = quizService.getQuiz(quizId);
        
        assertEquals(10, quiz.getTotalQuestions());
    }
}
