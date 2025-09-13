package com.VKJ.service;

import com.VKJ.entity.User;
import com.VKJ.enums.Role;
import com.VKJ.enums.UserStatus;
import com.VKJ.exception.ResourceNotFoundException;
import com.VKJ.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    public User getUserByIdOrThrow(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
    }

    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public Optional<User> getUserByMobile(String mobile) {
        return userRepository.findByMobile(mobile);
    }

    public User createUser(User user) {
        // Encode password if provided
        if (user.getPassword() != null) {
            user.setPassword(passwordEncoder.encode(user.getPassword()));
        }

        // Set default status if not provided
        if (user.getStatus() == null) {
            user.setStatus(UserStatus.ACTIVE);
        }

        return userRepository.save(user);
    }

    public User updateUser(Long id, User userDetails) {
        User user = getUserByIdOrThrow(id);

        if (userDetails.getName() != null) {
            user.setName(userDetails.getName());
        }
        if (userDetails.getEmail() != null) {
            user.setEmail(userDetails.getEmail());
        }
        if (userDetails.getMobile() != null) {
            user.setMobile(userDetails.getMobile());
        }
        if (userDetails.getAddress() != null) {
            user.setAddress(userDetails.getAddress());
        }
        if (userDetails.getPhotoUrl() != null) {
            user.setPhotoUrl(userDetails.getPhotoUrl());
        }
        if (userDetails.getAadharFrontUrl() != null) {
            user.setAadharFrontUrl(userDetails.getAadharFrontUrl());
        }
        if (userDetails.getAadharBackUrl() != null) {
            user.setAadharBackUrl(userDetails.getAadharBackUrl());
        }
        if (userDetails.getRoles() != null) {
            user.setRoles(userDetails.getRoles());
        }
        if (userDetails.getStatus() != null) {
            user.setStatus(userDetails.getStatus());
        }

        return userRepository.save(user);
    }

    public void deleteUser(Long id) {
        User user = getUserByIdOrThrow(id);
        userRepository.delete(user);
    }

    public User updateUserStatus(Long id, UserStatus status) {
        User user = getUserByIdOrThrow(id);
        user.setStatus(status);
        return userRepository.save(user);
    }

    public User updateUserRoles(Long id, Set<Role> roles) {
        User user = getUserByIdOrThrow(id);
        user.setRoles(roles);
        return userRepository.save(user);
    }

    public User changePassword(Long id, String oldPassword, String newPassword) {
        User user = getUserByIdOrThrow(id);

        // Verify old password
        if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
            throw new RuntimeException("Invalid old password");
        }

        // Update with new password
        user.setPassword(passwordEncoder.encode(newPassword));
        return userRepository.save(user);
    }

    public List<User> getUsersByRole(Role role) {
        return userRepository.findByRolesContaining(role);
    }

    public List<User> getUsersByRoleAndStatus(Role role, UserStatus status) {
        return userRepository.findByRolesContainingAndStatus(role, status);
    }

    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    public boolean existsByMobile(String mobile) {
        return userRepository.existsByMobile(mobile);
    }

    // OTP related methods
    public User generateAndSaveOTP(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));

        // Generate 6-digit OTP
        String otp = String.valueOf((int) (Math.random() * 900000) + 100000);

        user.setOtp(otp);
        user.setOtpExpiryTime(LocalDateTime.now().plus(10, ChronoUnit.MINUTES));

        return userRepository.save(user);
    }

    public boolean verifyOTP(String email, String otp) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));

        if (user.getOtp() == null || !user.getOtp().equals(otp)) {
            return false;
        }

        if (user.getOtpExpiryTime() == null || LocalDateTime.now().isAfter(user.getOtpExpiryTime())) {
            return false;
        }

        // Clear OTP after successful verification
        user.setOtp(null);
        user.setOtpExpiryTime(null);
        userRepository.save(user);

        return true;
    }

    public User resetPassword(String email, String newPassword) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));

        user.setPassword(passwordEncoder.encode(newPassword));
        return userRepository.save(user);
    }

    // Statistics methods
    public long getTotalUsersCount() {
        return userRepository.count();
    }

    public int getWeeklyUsersCount() {
        LocalDateTime startOfWeek = LocalDateTime.now().minus(7, ChronoUnit.DAYS);
        return userRepository.countWeeklyUsers(startOfWeek);
    }

    public int getMonthlyUsersCount() {
        LocalDateTime startOfMonth = LocalDateTime.now().minus(30, ChronoUnit.DAYS);
        return userRepository.countMonthlyUsers(startOfMonth);
    }

    public int getUsersCountBetweenDates(LocalDateTime startDate, LocalDateTime endDate) {
        return userRepository.countUsersBetweenDates(startDate, endDate);
    }

    public int getUsersCountByRole(Role role) {
        return userRepository.findByRolesContaining(role).size();
    }

    public int getUsersCountByRoleAndStatus(Role role, UserStatus status) {
        return userRepository.countByRolesContainingAndStatus(role, status);
    }

    // Admin specific methods
    public List<User> getAllCitizens() {
        return getUsersByRole(Role.ROLE_CITIZEN);
    }

    public List<User> getAllWorkers() {
        return getUsersByRole(Role.ROLE_WORKER);
    }

    public List<User> getAllContractors() {
        return getUsersByRole(Role.ROLE_CONTRACTOR);
    }

    public List<User> getAllAdmins() {
        return getUsersByRole(Role.ROLE_ADMIN);
    }

    public List<User> getPendingUsers() {
        return userRepository.findAll().stream()
                .filter(user -> user.getStatus() == UserStatus.PENDING)
                .toList();
    }

    public User approveUser(Long userId) {
        return updateUserStatus(userId, UserStatus.APPROVED);
    }

    public User rejectUser(Long userId) {
        return updateUserStatus(userId, UserStatus.REJECTED);
    }

    public User activateUser(Long userId) {
        return updateUserStatus(userId, UserStatus.ACTIVE);
    }

    public User deactivateUser(Long userId) {
        return updateUserStatus(userId, UserStatus.INACTIVE);
    }
}
