package com.taskapp.dto;

import com.taskapp.model.Priority;
import com.taskapp.model.RecurrenceType;
import com.taskapp.model.RecurrenceUnit;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;

public record TaskRequest(
        @NotBlank(message = "Title is required")
        @Size(max = 500, message = "Title must be at most 500 characters")
        String title,
        Priority priority,
        Boolean completed,
        LocalDate dueDate,
        RecurrenceType recurrenceType,
        Integer customIntervalValue,
        RecurrenceUnit customIntervalUnit
) {
}
