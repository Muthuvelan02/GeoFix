package com.VKJ.config;

import com.VKJ.entity.User;
import com.VKJ.enums.Role;
import com.VKJ.repository.UserRepository;
import com.VKJ.service.UserService;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.util.Set;

@Component
public class StartupRunner {

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostConstruct
    public void createDefaultSuperAdmin() {
        String email = "admin@gmail.com";
        String password = "password";

        Set<Role> roles = new HashSet<>();
        roles.add(Role.ROLE_SUPERADMIN);

        if (!userService.existsByEmail(email)) {
            User superAdmin = new User();
            superAdmin.setName("Super Admin");
            superAdmin.setEmail(email);
            superAdmin.setPassword(passwordEncoder.encode(password));
            superAdmin.setRoles(roles);
            userRepository.save(superAdmin);
            System.out.println("Default Super Admin created with email: " + email);
        } else {
            System.out.println("Super Admin already exists.");
        }
    }
}