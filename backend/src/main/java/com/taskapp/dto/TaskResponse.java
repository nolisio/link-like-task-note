package com.taskapp.dto;

import com.taskapp.model.Priority;
import com.taskapp.model.RecurrenceType;
import com.taskapp.model.RecurrenceUnit;
import java.time.LocalDate;
import java.time.LocalDateTime;

public record TaskResponse(
        Long id,
        String title,
        boolean completed,
        Priority priority,
        LocalDate dueDate,
        RecurrenceType recurrenceType,
        Integer customIntervalValue,
        RecurrenceUnit customIntervalUnit,
        LocalDateTime lastResetAt,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}
