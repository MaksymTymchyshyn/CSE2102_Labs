package com.example.demo;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(ValidationController.class)
public class ValidationControllerTest {

    @Autowired
    private MockMvc mockMvc;

    // Password Quality Tests
    @Test
    public void testStrongPassword() throws Exception {
        mockMvc.perform(get("/password-quality")
                .param("password", "StrongP@ss123"))
                .andExpect(status().isOk())
                .andExpect(content().string("strong"));
    }

    @Test
    public void testAnotherStrongPassword() throws Exception {
        mockMvc.perform(get("/password-quality")
                .param("password", "MyP@ssw0rd!"))
                .andExpect(status().isOk())
                .andExpect(content().string("strong"));
    }

    @Test
    public void testMediumPassword() throws Exception {
        mockMvc.perform(get("/password-quality")
                .param("password", "Pass123"))
                .andExpect(status().isOk())
                .andExpect(content().string("medium"));
    }

    @Test
    public void testMediumPasswordWithSpecialChar() throws Exception {
        mockMvc.perform(get("/password-quality")
                .param("password", "pass@word"))
                .andExpect(status().isOk())
                .andExpect(content().string("medium"));
    }

    @Test
    public void testWeakPassword() throws Exception {
        mockMvc.perform(get("/password-quality")
                .param("password", "weak"))
                .andExpect(status().isOk())
                .andExpect(content().string("weak"));
    }

    @Test
    public void testWeakPasswordOnlyNumbers() throws Exception {
        mockMvc.perform(get("/password-quality")
                .param("password", "12345"))
                .andExpect(status().isOk())
                .andExpect(content().string("weak"));
    }

    @Test
    public void testWeakPasswordEmpty() throws Exception {
        mockMvc.perform(get("/password-quality")
                .param("password", ""))
                .andExpect(status().isOk())
                .andExpect(content().string("weak"));
    }

    @Test
    public void testWeakPasswordShort() throws Exception {
        mockMvc.perform(get("/password-quality")
                .param("password", "Ab1!"))
                .andExpect(status().isOk())
                .andExpect(content().string("weak"));
    }

    // Email Validation Tests
    @Test
    public void testValidEmail() throws Exception {
        mockMvc.perform(get("/email-address-valid")
                .param("email", "user@example.com"))
                .andExpect(status().isOk())
                .andExpect(content().string("valid"));
    }

    @Test
    public void testValidEmailWithNumbers() throws Exception {
        mockMvc.perform(get("/email-address-valid")
                .param("email", "user123@test.org"))
                .andExpect(status().isOk())
                .andExpect(content().string("valid"));
    }

    @Test
    public void testValidEmailWithDots() throws Exception {
        mockMvc.perform(get("/email-address-valid")
                .param("email", "first.last@company.com"))
                .andExpect(status().isOk())
                .andExpect(content().string("valid"));
    }

    @Test
    public void testValidEmailWithPlus() throws Exception {
        mockMvc.perform(get("/email-address-valid")
                .param("email", "user+tag@example.com"))
                .andExpect(status().isOk())
                .andExpect(content().string("valid"));
    }

    @Test
    public void testInvalidEmailNoAt() throws Exception {
        mockMvc.perform(get("/email-address-valid")
                .param("email", "userexample.com"))
                .andExpect(status().isOk())
                .andExpect(content().string("invalid"));
    }

    @Test
    public void testInvalidEmailNoDomain() throws Exception {
        mockMvc.perform(get("/email-address-valid")
                .param("email", "user@"))
                .andExpect(status().isOk())
                .andExpect(content().string("invalid"));
    }

    @Test
    public void testInvalidEmailNoTLD() throws Exception {
        mockMvc.perform(get("/email-address-valid")
                .param("email", "user@domain"))
                .andExpect(status().isOk())
                .andExpect(content().string("invalid"));
    }

    @Test
    public void testInvalidEmailEmpty() throws Exception {
        mockMvc.perform(get("/email-address-valid")
                .param("email", ""))
                .andExpect(status().isOk())
                .andExpect(content().string("invalid"));
    }

    @Test
    public void testInvalidEmailMultipleAt() throws Exception {
        mockMvc.perform(get("/email-address-valid")
                .param("email", "user@@example.com"))
                .andExpect(status().isOk())
                .andExpect(content().string("invalid"));
    }

    @Test
    public void testInvalidEmailSpaces() throws Exception {
        mockMvc.perform(get("/email-address-valid")
                .param("email", "user name@example.com"))
                .andExpect(status().isOk())
                .andExpect(content().string("invalid"));
    }
}
