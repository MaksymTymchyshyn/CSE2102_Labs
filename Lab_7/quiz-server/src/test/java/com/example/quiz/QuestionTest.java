package com.example.quiz;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Unit tests for the Question model class.
 */
class QuestionTest {

    private Question question;
    private List<String> options;

    @BeforeEach
    void setUp() {
        options = Arrays.asList(
            "Java Virtual Machine",
            "Java Variable Method",
            "Java Version Manager",
            "Java Visual Mode"
        );
        question = new Question(1, "What does JVM stand for?", options, 0);
    }

    @Test
    void testQuestionCreation() {
        assertNotNull(question);
        assertEquals(1, question.getId());
        assertEquals("What does JVM stand for?", question.getText());
        assertEquals(4, question.getOptions().size());
        assertEquals(0, question.getCorrectAnswerIndex());
    }

    @Test
    void testDefaultConstructor() {
        Question emptyQuestion = new Question();
        assertNotNull(emptyQuestion);
        assertNotNull(emptyQuestion.getOptions());
        assertTrue(emptyQuestion.getOptions().isEmpty());
    }

    @Test
    void testGettersAndSetters() {
        Question newQuestion = new Question();
        
        newQuestion.setId(2);
        assertEquals(2, newQuestion.getId());
        
        newQuestion.setText("Test question?");
        assertEquals("Test question?", newQuestion.getText());
        
        List<String> newOptions = Arrays.asList("A", "B", "C");
        newQuestion.setOptions(newOptions);
        assertEquals(3, newQuestion.getOptions().size());
        
        newQuestion.setCorrectAnswerIndex(1);
        assertEquals(1, newQuestion.getCorrectAnswerIndex());
    }

    @Test
    void testIsCorrect_WithCorrectAnswer() {
        assertTrue(question.isCorrect(0));
    }

    @Test
    void testIsCorrect_WithIncorrectAnswer() {
        assertFalse(question.isCorrect(1));
        assertFalse(question.isCorrect(2));
        assertFalse(question.isCorrect(3));
    }

    @Test
    void testIsCorrect_WithInvalidIndex() {
        assertFalse(question.isCorrect(-1));
        assertFalse(question.isCorrect(4));
        assertFalse(question.isCorrect(100));
    }

    @Test
    void testQuestionWithDifferentCorrectAnswerIndex() {
        Question q2 = new Question(2, "Which is correct?", 
            Arrays.asList("A", "B", "C", "D"), 2);
        
        assertFalse(q2.isCorrect(0));
        assertFalse(q2.isCorrect(1));
        assertTrue(q2.isCorrect(2));
        assertFalse(q2.isCorrect(3));
    }

    @Test
    void testQuestionWithEmptyText() {
        Question emptyTextQuestion = new Question(3, "", options, 0);
        assertEquals("", emptyTextQuestion.getText());
    }

    @Test
    void testQuestionWithEmptyOptions() {
        Question emptyOptionsQuestion = new Question(4, "Question?", 
            Arrays.asList(), 0);
        assertEquals(0, emptyOptionsQuestion.getOptions().size());
    }

    @Test
    void testQuestionOptionsAccessibility() {
        Question question = new Question(1, "Test?", 
            Arrays.asList("A", "B", "C", "D"), 0);
        
        List<String> originalOptions = question.getOptions();
        int originalSize = originalOptions.size();
        
        // Verify we get the options
        assertEquals(4, originalSize);
        
        // Verify all options are accessible
        assertEquals("A", originalOptions.get(0));
        assertEquals("B", originalOptions.get(1));
        assertEquals("C", originalOptions.get(2));
        assertEquals("D", originalOptions.get(3));
    }
}
