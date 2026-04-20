package com.taskapp.dto;

public record AuthResponse(
        String token,
        UserResponse user
) {
}
