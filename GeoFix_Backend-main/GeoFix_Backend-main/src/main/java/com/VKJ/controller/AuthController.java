package com.VKJ.controller;

import com.VKJ.dto.LoginRequest;
import com.VKJ.dto.LoginResponse;
import com.VKJ.dto.SignupRequest;
import com.VKJ.entity.User;
import com.VKJ.enums.Role;
import com.VKJ.service.AuthService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private ObjectMapper objectMapper;

    @PostMapping("/si`gn`up")
    public ResponseEntity<?> signup(
            @RequestPart("userData") String userDataJson,
            @RequestPart(value = "photo", required = false) MultipartFile photo,
            @RequestPart(value = "aadharFront", required = false) MultipartFile aadharFront,
            @RequestPart(value = "aadharBack", required = false) MultipartFile aadharBack) {
        try {
            // Parse the JSON string to SignupRequest object
            SignupRequest signupRequest = objectMapper.readValue(userDataJson, SignupRequest.class);

            // Validate document requirements based on role
            if (signupRequest.getRole() == Role.ROLE_ADMIN) {
                if (photo == null || photo.isEmpty() ||
                        aadharFront == null || aadharFront.isEmpty() ||
                        aadharBack == null || aadharBack.isEmpty()) {
                    return ResponseEntity.badRequest().body(Map.of(
                            "error", "Admin registration requires photo, Aadhar front and back documents"
                    ));
                }
            }

            String result = authService.signup(signupRequest, photo, aadharFront, aadharBack);
            return ResponseEntity.ok(Map.of("message", result));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid JSON format or signup failed: " + e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest loginRequest) {
        LoginResponse loginResponse = authService.login(loginRequest);
        return ResponseEntity.ok(loginResponse);
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        // You can enhance this by adding token invalidation in AuthService if needed
        return ResponseEntity.ok(Map.of("message", "Logged out successfully"));
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User user = authService.getProfile(authentication.getName());
        return ResponseEntity.ok(user);
    }

    @PutMapping(value = "/update-profile", consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
    public ResponseEntity<?> updateProfile(
            @RequestPart(value = "userData", required = true) String userDataJson,
            @RequestPart(value = "photo", required = false) MultipartFile photo,
            @RequestPart(value = "aadharFront", required = false) MultipartFile aadharFront,
            @RequestPart(value = "aadharBack", required = false) MultipartFile aadharBack,
            Authentication authentication) {

        return authService.updateProfile(userDataJson, photo, aadharFront, aadharBack, authentication);
    }
}