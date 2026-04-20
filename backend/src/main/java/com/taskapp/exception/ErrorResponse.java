package com.taskapp.exception;

public record ErrorResponse(
        String error,
        String message,
        int status
) {
}
