package com.example.demo;

import org.springframework.web.bind.annotation.*;
import java.util.regex.Pattern;

@RestController
public class ValidationController {

    /**
     * Endpoint to check password quality
     * Returns "strong", "medium", or "weak" based on password criteria
     * 
     * Strong: At least 8 characters, contains uppercase, lowercase, digit, and special character
     * Medium: At least 6 characters, contains at least 2 of the character types
     * Weak: Everything else
     */
    @GetMapping("/password-quality")
    public String checkPasswordQuality(@RequestParam String password) {
        if (password == null || password.isEmpty()) {
            return "weak";
        }

        boolean hasUpperCase = password.chars().anyMatch(Character::isUpperCase);
        boolean hasLowerCase = password.chars().anyMatch(Character::isLowerCase);
        boolean hasDigit = password.chars().anyMatch(Character::isDigit);
        boolean hasSpecialChar = password.chars().anyMatch(ch -> 
            !Character.isLetterOrDigit(ch));

        int criteriaCount = (hasUpperCase ? 1 : 0) + (hasLowerCase ? 1 : 0) + 
                           (hasDigit ? 1 : 0) + (hasSpecialChar ? 1 : 0);

        if (password.length() >= 8 && criteriaCount >= 4) {
            return "strong";
        } else if (password.length() >= 6 && criteriaCount >= 2) {
            return "medium";
        } else {
            return "weak";
        }
    }

    /**
     * Endpoint to validate email address
     * Returns "valid" or "invalid"
     */
    @GetMapping("/email-address-valid")
    public String checkEmailValid(@RequestParam String email) {
        if (email == null || email.isEmpty()) {
            return "invalid";
        }

        // Basic email validation pattern
        // Checks for: localpart@domain.tld format
        String emailRegex = "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$";
        Pattern pattern = Pattern.compile(emailRegex);
        
        if (pattern.matcher(email).matches()) {
            return "valid";
        } else {
            return "invalid";
        }
    }
}
