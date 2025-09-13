package com.VKJ.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class LoginResponse {
    private String token;
    private Long userId;
    private List<String> roles;

    public LoginResponse(String token, Long userId, List<String> roles) {
        this.token = token;
        this.userId = userId;
        this.roles = roles;
    }
}