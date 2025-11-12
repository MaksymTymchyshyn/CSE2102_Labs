package com.example.quiz;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for the QuizController.
 */
@WebMvcTest(QuizController.class)
class QuizControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private QuizService quizService;

    @Test
    void testHome() throws Exception {
        mockMvc.perform(get("/"))
                .andExpect(status().isOk())
                .andExpect(view().name("index"));
    }

    @Test
    void testStartQuiz_Success() throws Exception {
        when(quizService.createQuiz("John Doe")).thenReturn("quiz-123");

        mockMvc.perform(post("/start")
                        .param("userName", "John Doe"))
                .andExpect(status().is3xxRedirection())
                .andExpect(redirectedUrl("/quiz/quiz-123"));

        verify(quizService, times(1)).createQuiz("John Doe");
    }

    @Test
    void testStartQuiz_EmptyName() throws Exception {
        mockMvc.perform(post("/start")
                        .param("userName", ""))
                .andExpect(status().isOk())
                .andExpect(view().name("index"))
                .andExpect(model().attributeExists("error"));

        verify(quizService, never()).createQuiz(anyString());
    }

    @Test
    void testStartQuiz_WhitespaceName() throws Exception {
        mockMvc.perform(post("/start")
                        .param("userName", "   "))
                .andExpect(status().isOk())
                .andExpect(view().name("index"))
                .andExpect(model().attributeExists("error"));

        verify(quizService, never()).createQuiz(anyString());
    }

    @Test
    void testShowQuestion_Success() throws Exception {
        Quiz quiz = createMockQuiz();
        when(quizService.getQuiz("quiz-123")).thenReturn(quiz);

        mockMvc.perform(get("/quiz/quiz-123"))
                .andExpect(status().isOk())
                .andExpect(view().name("question"))
                .andExpect(model().attributeExists("quiz"))
                .andExpect(model().attributeExists("question"))
                .andExpect(model().attributeExists("questionNumber"))
                .andExpect(model().attributeExists("totalQuestions"));

        verify(quizService, times(1)).getQuiz("quiz-123");
    }

    @Test
    void testShowQuestion_QuizNotFound() throws Exception {
        when(quizService.getQuiz("invalid-id")).thenReturn(null);

        mockMvc.perform(get("/quiz/invalid-id"))
                .andExpect(status().isOk())
                .andExpect(view().name("error"))
                .andExpect(model().attributeExists("error"));

        verify(quizService, times(1)).getQuiz("invalid-id");
    }

    @Test
    void testShowQuestion_QuizCompleted() throws Exception {
        Quiz quiz = createMockQuiz();
        quiz.setCompleted(true);
        when(quizService.getQuiz("quiz-123")).thenReturn(quiz);

        mockMvc.perform(get("/quiz/quiz-123"))
                .andExpect(status().is3xxRedirection())
                .andExpect(redirectedUrl("/quiz/quiz-123/results"));

        verify(quizService, times(1)).getQuiz("quiz-123");
    }

    @Test
    void testSubmitAnswer_Success() throws Exception {
        Quiz quiz = createMockQuiz();
        when(quizService.getQuiz("quiz-123")).thenReturn(quiz);
        when(quizService.nextQuestion("quiz-123")).thenReturn(true);

        mockMvc.perform(post("/quiz/quiz-123/answer")
                        .param("questionId", "1")
                        .param("answerIndex", "0"))
                .andExpect(status().is3xxRedirection())
                .andExpect(redirectedUrl("/quiz/quiz-123"));

        verify(quizService, times(1)).submitAnswer("quiz-123", 1, 0);
        verify(quizService, times(1)).nextQuestion("quiz-123");
    }

    @Test
    void testSubmitAnswer_LastQuestion() throws Exception {
        Quiz quiz = createMockQuiz();
        when(quizService.getQuiz("quiz-123")).thenReturn(quiz);
        when(quizService.nextQuestion("quiz-123")).thenReturn(false);
        when(quizService.completeQuiz("quiz-123")).thenReturn(quiz);

        mockMvc.perform(post("/quiz/quiz-123/answer")
                        .param("questionId", "1")
                        .param("answerIndex", "0"))
                .andExpect(status().is3xxRedirection())
                .andExpect(redirectedUrl("/quiz/quiz-123/results"));

        verify(quizService, times(1)).submitAnswer("quiz-123", 1, 0);
        verify(quizService, times(1)).nextQuestion("quiz-123");
        verify(quizService, times(1)).completeQuiz("quiz-123");
    }

    @Test
    void testSubmitAnswer_QuizNotFound() throws Exception {
        when(quizService.getQuiz("invalid-id")).thenReturn(null);

        mockMvc.perform(post("/quiz/invalid-id/answer")
                        .param("questionId", "1")
                        .param("answerIndex", "0"))
                .andExpect(status().isOk())
                .andExpect(view().name("error"))
                .andExpect(model().attributeExists("error"));

        verify(quizService, times(1)).getQuiz("invalid-id");
        verify(quizService, never()).submitAnswer(anyString(), anyInt(), anyInt());
    }

    @Test
    void testShowResults_Success() throws Exception {
        Quiz quiz = createMockQuiz();
        quiz.setCompleted(true);
        quiz.submitAnswer(1, 0);
        quiz.submitAnswer(2, 0);
        
        when(quizService.getQuiz("quiz-123")).thenReturn(quiz);

        mockMvc.perform(get("/quiz/quiz-123/results"))
                .andExpect(status().isOk())
                .andExpect(view().name("results"))
                .andExpect(model().attributeExists("quiz"))
                .andExpect(model().attributeExists("score"))
                .andExpect(model().attributeExists("total"))
                .andExpect(model().attributeExists("percentage"));

        verify(quizService, times(1)).getQuiz("quiz-123");
    }

    @Test
    void testShowResults_QuizNotFound() throws Exception {
        when(quizService.getQuiz("invalid-id")).thenReturn(null);

        mockMvc.perform(get("/quiz/invalid-id/results"))
                .andExpect(status().isOk())
                .andExpect(view().name("error"))
                .andExpect(model().attributeExists("error"));

        verify(quizService, times(1)).getQuiz("invalid-id");
    }

    @Test
    void testShowResults_QuizNotCompleted() throws Exception {
        Quiz quiz = createMockQuiz();
        quiz.setCompleted(false);
        when(quizService.getQuiz("quiz-123")).thenReturn(quiz);

        mockMvc.perform(get("/quiz/quiz-123/results"))
                .andExpect(status().isOk())
                .andExpect(view().name("results"))
                .andExpect(model().attributeExists("quiz"));

        // Quiz should be marked as completed
        verify(quizService, times(1)).getQuiz("quiz-123");
    }

    // Helper method to create a mock quiz
    private Quiz createMockQuiz() {
        Question q1 = new Question(1, "What is Java?",
                Arrays.asList("A language", "A drink", "An island", "A framework"), 0);
        Question q2 = new Question(2, "What is OOP?",
                Arrays.asList("Object Oriented Programming", "Only One Program", "Out Of Place", "Open Office Project"), 0);

        Quiz quiz = new Quiz("quiz-123", "John Doe", Arrays.asList(q1, q2));
        return quiz;
    }
}
