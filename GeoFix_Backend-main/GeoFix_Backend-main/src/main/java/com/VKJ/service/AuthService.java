package com.VKJ.service;

import com.VKJ.dto.LoginRequest;
import com.VKJ.dto.LoginResponse;
import com.VKJ.dto.SignupRequest;
import com.VKJ.entity.User;
import com.VKJ.enums.Role;
import com.VKJ.enums.UserStatus;
import com.VKJ.repository.AuthRepository;
import com.VKJ.security.JwtTokenProvider;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class AuthService {

    @Autowired
    private AuthRepository authRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    private final String uploadDir = "uploads/";

    public LoginResponse login(LoginRequest loginRequest) {
        // Find user by email or mobile
        Optional<User> userOptional;
        if (loginRequest.getEmail() != null && !loginRequest.getEmail().isEmpty()) {
            userOptional = authRepository.findByEmail(loginRequest.getEmail());
        } else if (loginRequest.getMobile() != null && !loginRequest.getMobile().isEmpty()) {
            userOptional = authRepository.findByMobile(loginRequest.getMobile());
        } else {
            throw new RuntimeException("Email or mobile is required");
        }

        if (userOptional.isEmpty()) {
            throw new RuntimeException("User not found");
        }

        User user = userOptional.get();

        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        if (user.getStatus() != UserStatus.ACTIVE) {
            throw new RuntimeException("Account is not active");
        }

        // Update last login
        user.setLastLogin(LocalDateTime.now());
        authRepository.save(user);

        // Generate JWT token
        String token = jwtTokenProvider.generateToken(user.getEmail(), user.getRoles());

        // Convert roles to string list
        List<String> roleStrings = user.getRoles().stream()
                .map(Role::name)
                .collect(Collectors.toList());

        return new LoginResponse(token, user.getId(), roleStrings);
    }

    public User signup(SignupRequest signupRequest) {
        User user = signupInternal(signupRequest, null, null, null);
        return user;
    }

    public String signup(SignupRequest signupRequest, MultipartFile photo, MultipartFile aadharFront, MultipartFile aadharBack) {
        signupInternal(signupRequest, photo, aadharFront, aadharBack);
        return "User registered successfully";
    }

    private User signupInternal(SignupRequest signupRequest, MultipartFile photo, MultipartFile aadharFront, MultipartFile aadharBack) {
        // Check if user already exists
        if (authRepository.existsByEmail(signupRequest.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        // Create new user
        User user = new User();
        user.setName(signupRequest.getName());
        user.setEmail(signupRequest.getEmail());
        user.setMobile(signupRequest.getMobile());
        user.setAddress(signupRequest.getAddress());
        user.setPassword(passwordEncoder.encode(signupRequest.getPassword()));

        // Set default role if not provided
        Set<Role> roles = new HashSet<>();
        if (signupRequest.getRole() != null) {
            roles.add(signupRequest.getRole());
        } else {
            roles.add(Role.ROLE_CITIZEN); // Default role
        }
        user.setRoles(roles);

        // Handle file uploads
        try {
            if (photo != null && !photo.isEmpty()) {
                String photoUrl = saveFile(photo, "photo");
                user.setPhotoUrl(photoUrl);
            }

            if (aadharFront != null && !aadharFront.isEmpty()) {
                String aadharFrontUrl = saveFile(aadharFront, "aadhar_front");
                user.setAadharFrontUrl(aadharFrontUrl);
            }

            if (aadharBack != null && !aadharBack.isEmpty()) {
                String aadharBackUrl = saveFile(aadharBack, "aadhar_back");
                user.setAadharBackUrl(aadharBackUrl);
            }
        } catch (IOException e) {
            throw new RuntimeException("Error uploading files: " + e.getMessage());
        }

        // Set default status
        user.setStatus(UserStatus.ACTIVE);

        return authRepository.save(user);
    }

    public User getProfile(String email) {
        return authRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public ResponseEntity<?> updateProfile(String userDataJson, MultipartFile photo, MultipartFile aadharFront, MultipartFile aadharBack, Authentication authentication) {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            User userUpdates = objectMapper.readValue(userDataJson, User.class);

            User existingUser = authRepository.findByEmail(authentication.getName())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // Update basic fields
            if (userUpdates.getName() != null) {
                existingUser.setName(userUpdates.getName());
            }
            if (userUpdates.getMobile() != null) {
                existingUser.setMobile(userUpdates.getMobile());
            }
            if (userUpdates.getAddress() != null) {
                existingUser.setAddress(userUpdates.getAddress());
            }

            // Handle file updates
            if (photo != null && !photo.isEmpty()) {
                String photoUrl = saveFile(photo, "photo");
                existingUser.setPhotoUrl(photoUrl);
            }

            if (aadharFront != null && !aadharFront.isEmpty()) {
                String aadharFrontUrl = saveFile(aadharFront, "aadhar_front");
                existingUser.setAadharFrontUrl(aadharFrontUrl);
            }

            if (aadharBack != null && !aadharBack.isEmpty()) {
                String aadharBackUrl = saveFile(aadharBack, "aadhar_back");
                existingUser.setAadharBackUrl(aadharBackUrl);
            }

            User updatedUser = authRepository.save(existingUser);
            return ResponseEntity.ok(Map.of("message", "Profile updated successfully", "user", updatedUser));

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Error updating profile: " + e.getMessage()));
        }
    }

    private String saveFile(MultipartFile file, String fileType) throws IOException {
        // Create uploads directory if it doesn't exist
        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        // Generate unique filename
        String originalFilename = file.getOriginalFilename();
        String fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
        String uniqueFilename = fileType + "_" + UUID.randomUUID().toString() + fileExtension;

        // Save file
        Path filePath = uploadPath.resolve(uniqueFilename);
        Files.copy(file.getInputStream(), filePath);

        return filePath.toString();
    }

    public boolean existsByEmail(String email) {
        return authRepository.existsByEmail(email);
    }

    public Optional<User> findByEmail(String email) {
        return authRepository.findByEmail(email);
    }

    public User save(User user) {
        return authRepository.save(user);
    }

    // Method to validate JWT token
    public boolean validateToken(String token) {
        return jwtTokenProvider.validateToken(token);
    }

    // Method to get user from JWT token
    public String getUsernameFromToken(String token) {
        return jwtTokenProvider.getUsernameFromJWT(token);
    }
}
