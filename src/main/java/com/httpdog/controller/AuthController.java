package com.httpdog.controller;

import com.httpdog.model.User;
import com.httpdog.service.UserService;
import com.httpdog.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {
    @Autowired
    private UserService userService;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody Map<String, String> credentials) {
        try {
            User user = userService.registerUser(
                credentials.get("email"),
                credentials.get("password")
            );
            return ResponseEntity.ok(Map.of("message", "User registered, Welcome to website!"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

   @PostMapping("/login")
public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
    try {
        User user = userService.findByEmail(credentials.get("email"));
        String token = jwtTokenProvider.generateToken(user);

        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("user", Map.of(
            "id", user.getId(),
            "email", user.getEmail()
        ));

        return ResponseEntity.ok(response);
    } catch (Exception e) {
        return ResponseEntity.badRequest().body(Map.of("error", "Enter a Valid Details:"));
    }
}

} 