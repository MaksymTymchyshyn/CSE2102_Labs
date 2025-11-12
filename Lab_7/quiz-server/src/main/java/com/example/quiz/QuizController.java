package com.example.quiz;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

/**
 * Controller for handling quiz web requests with Thymeleaf views.
 */
@Controller
public class QuizController {

    @Autowired
    private QuizService quizService;

    /**
     * Home page - start a new quiz
     */
    @GetMapping("/")
    public String home() {
        return "index";
    }

    /**
     * Start a new quiz with the user's name
     */
    @PostMapping("/start")
    public String startQuiz(@RequestParam("userName") String userName, Model model) {
        if (userName == null || userName.trim().isEmpty()) {
            model.addAttribute("error", "Please enter your name");
            return "index";
        }
        
        String quizId = quizService.createQuiz(userName.trim());
        model.addAttribute("quizId", quizId);
        
        // Forward to quiz directly instead of redirect
        Quiz quiz = quizService.getQuiz(quizId);
        Question currentQuestion = quiz.getCurrentQuestion();
        
        model.addAttribute("quiz", quiz);
        model.addAttribute("question", currentQuestion);
        model.addAttribute("questionNumber", 1);
        model.addAttribute("totalQuestions", quiz.getTotalQuestions());
        
        return "question";
    }

    /**
     * Display the current question for a quiz
     */
    @GetMapping("/quiz/{quizId}")
    public String showQuestion(@PathVariable String quizId, Model model) {
        Quiz quiz = quizService.getQuiz(quizId);
        
        if (quiz == null) {
            model.addAttribute("error", "Quiz not found");
            return "error";
        }
        
        if (quiz.isCompleted()) {
            return "redirect:/quiz/" + quizId + "/results";
        }
        
        Question currentQuestion = quiz.getCurrentQuestion();
        if (currentQuestion == null) {
            return "redirect:/quiz/" + quizId + "/results";
        }
        
        model.addAttribute("quiz", quiz);
        model.addAttribute("question", currentQuestion);
        model.addAttribute("questionNumber", quiz.getCurrentQuestionIndex() + 1);
        model.addAttribute("totalQuestions", quiz.getTotalQuestions());
        
        return "question";
    }

    /**
     * Submit an answer for the current question
     */
    @PostMapping("/quiz/{quizId}/answer")
    public String submitAnswer(
            @PathVariable String quizId,
            @RequestParam("questionId") int questionId,
            @RequestParam("answerIndex") int answerIndex,
            Model model) {
        
        Quiz quiz = quizService.getQuiz(quizId);
        
        if (quiz == null) {
            model.addAttribute("error", "Quiz not found");
            return "error";
        }
        
        // Submit the answer
        quizService.submitAnswer(quizId, questionId, answerIndex);
        
        // Move to next question or complete
        boolean hasNext = quizService.nextQuestion(quizId);
        
        if (hasNext) {
            // Show next question directly
            Question currentQuestion = quiz.getCurrentQuestion();
            model.addAttribute("quiz", quiz);
            model.addAttribute("question", currentQuestion);
            model.addAttribute("questionNumber", quiz.getCurrentQuestionIndex() + 1);
            model.addAttribute("totalQuestions", quiz.getTotalQuestions());
            return "question";
        } else {
            // Show results
            quizService.completeQuiz(quizId);
            int score = quiz.calculateScore();
            int total = quiz.getTotalQuestions();
            double percentage = quiz.getPercentageScore();
            
            model.addAttribute("quiz", quiz);
            model.addAttribute("score", score);
            model.addAttribute("total", total);
            model.addAttribute("percentage", percentage);
            model.addAttribute("percentageFormatted", String.format("%.1f", percentage));
            
            return "results";
        }
    }

    /**
     * Display quiz results
     */
    @GetMapping("/quiz/{quizId}/results")
    public String showResults(@PathVariable String quizId, Model model) {
        Quiz quiz = quizService.getQuiz(quizId);
        
        if (quiz == null) {
            model.addAttribute("error", "Quiz not found");
            return "error";
        }
        
        if (!quiz.isCompleted()) {
            quiz.setCompleted(true);
        }
        
        int score = quiz.calculateScore();
        int total = quiz.getTotalQuestions();
        double percentage = quiz.getPercentageScore();
        
        model.addAttribute("quiz", quiz);
        model.addAttribute("score", score);
        model.addAttribute("total", total);
        model.addAttribute("percentage", percentage);
        model.addAttribute("percentageFormatted", String.format("%.1f", percentage));
        
        return "results";
    }
}
