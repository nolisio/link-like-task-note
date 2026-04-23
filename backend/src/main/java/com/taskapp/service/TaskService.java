package com.taskapp.service;

import com.taskapp.dto.TaskRequest;
import com.taskapp.dto.TaskResponse;
import com.taskapp.model.Priority;
import com.taskapp.model.RecurrenceType;
import com.taskapp.model.RecurrenceUnit;
import com.taskapp.model.Task;
import com.taskapp.model.User;
import com.taskapp.repository.TaskRepository;
import com.taskapp.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class TaskService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    private final RecurrenceResetService recurrenceResetService;

    public TaskService(
            TaskRepository taskRepository,
            UserRepository userRepository,
            RecurrenceResetService recurrenceResetService
    ) {
        this.taskRepository = taskRepository;
        this.userRepository = userRepository;
        this.recurrenceResetService = recurrenceResetService;
    }

    public List<TaskResponse> getTasks(Authentication authentication) {
        User user = getAuthenticatedUser(authentication);
        List<Task> tasks = taskRepository.findAllByUserOrderByCreatedAtDesc(user);
        recurrenceResetService.applyResets(tasks);
        return tasks.stream().map(this::toResponse).toList();
    }

    public TaskResponse createTask(TaskRequest request, Authentication authentication) {
        User user = getAuthenticatedUser(authentication);

        Task task = new Task();
        task.setTitle(request.title().trim());
        task.setPriority(request.priority() != null ? request.priority() : Priority.MEDIUM);
        task.setDueDate(request.dueDate());
        task.setCompleted(false);
        task.setUser(user);

        RecurrenceType type = request.recurrenceType() != null ? request.recurrenceType() : RecurrenceType.ONCE;
        task.setRecurrenceType(type);
        if (type == RecurrenceType.CUSTOM) {
            validateCustomRecurrence(request.customIntervalValue(), request.customIntervalUnit());
            task.setCustomIntervalValue(request.customIntervalValue());
            task.setCustomIntervalUnit(request.customIntervalUnit());
        } else {
            task.setCustomIntervalValue(null);
            task.setCustomIntervalUnit(null);
        }
        task.setLastResetAt(type == RecurrenceType.ONCE ? null : LocalDateTime.now());

        return toResponse(taskRepository.save(task));
    }

    public TaskResponse updateTask(Long id, TaskRequest request, Authentication authentication) {
        User user = getAuthenticatedUser(authentication);
        Task task = taskRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new EntityNotFoundException("Task not found"));

        if (request.title() != null) {
            String title = request.title().trim();
            if (title.isEmpty()) {
                throw new IllegalArgumentException("Title is required");
            }
            if (title.length() > 500) {
                throw new IllegalArgumentException("Title must be at most 500 characters");
            }
            task.setTitle(title);
        }
        if (request.priority() != null) {
            task.setPriority(request.priority());
        }
        if (request.completed() != null) {
            task.setCompleted(request.completed());
        }
        task.setDueDate(request.dueDate());

        if (request.recurrenceType() != null) {
            RecurrenceType type = request.recurrenceType();
            task.setRecurrenceType(type);
            if (type == RecurrenceType.CUSTOM) {
                validateCustomRecurrence(request.customIntervalValue(), request.customIntervalUnit());
                task.setCustomIntervalValue(request.customIntervalValue());
                task.setCustomIntervalUnit(request.customIntervalUnit());
            } else {
                task.setCustomIntervalValue(null);
                task.setCustomIntervalUnit(null);
            }
            if (type != RecurrenceType.ONCE && task.getLastResetAt() == null) {
                task.setLastResetAt(LocalDateTime.now());
            }
            if (type == RecurrenceType.ONCE) {
                task.setLastResetAt(null);
            }
        }

        return toResponse(taskRepository.save(task));
    }

    public void deleteTask(Long id, Authentication authentication) {
        User user = getAuthenticatedUser(authentication);
        Task task = taskRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new EntityNotFoundException("Task not found"));
        taskRepository.delete(task);
    }

    private void validateCustomRecurrence(Integer value, RecurrenceUnit unit) {
        if (value == null || value <= 0) {
            throw new IllegalArgumentException("customIntervalValue must be a positive integer for CUSTOM recurrence");
        }
        if (unit == null) {
            throw new IllegalArgumentException("customIntervalUnit is required for CUSTOM recurrence");
        }
    }

    private User getAuthenticatedUser(Authentication authentication) {
        if (authentication == null || authentication.getName() == null) {
            throw new IllegalArgumentException("Authentication is required");
        }

        return userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new EntityNotFoundException("User not found"));
    }

    private TaskResponse toResponse(Task task) {
        return new TaskResponse(
                task.getId(),
                task.getTitle(),
                task.isCompleted(),
                task.getPriority(),
                task.getDueDate(),
                task.getRecurrenceType(),
                task.getCustomIntervalValue(),
                task.getCustomIntervalUnit(),
                task.getLastResetAt(),
                task.getCreatedAt(),
                task.getUpdatedAt()
        );
    }
}
