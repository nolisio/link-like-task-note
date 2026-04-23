package com.taskapp.service;

import com.taskapp.model.RecurrenceType;
import com.taskapp.model.RecurrenceUnit;
import com.taskapp.model.Task;
import com.taskapp.repository.TaskRepository;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.temporal.ChronoField;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class RecurrenceResetService {

    private static final ZoneId ZONE = ZoneId.of("Asia/Tokyo");

    private final TaskRepository taskRepository;

    public RecurrenceResetService(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    public void applyResets(List<Task> tasks) {
        LocalDateTime nowLocal = LocalDateTime.now();
        ZonedDateTime nowZoned = ZonedDateTime.now(ZONE);

        for (Task task : tasks) {
            if (!shouldReset(task, nowZoned)) {
                continue;
            }
            task.setCompleted(false);
            task.setLastResetAt(nowLocal);
            taskRepository.save(task);
        }
    }

    private boolean shouldReset(Task task, ZonedDateTime now) {
        RecurrenceType type = task.getRecurrenceType();
        if (type == null || type == RecurrenceType.ONCE) {
            return false;
        }
        if (!task.isCompleted()) {
            return false;
        }
        LocalDateTime last = task.getLastResetAt();
        if (last == null) {
            return true;
        }
        ZonedDateTime lastZoned = last.atZone(ZONE);

        return switch (type) {
            case DAILY -> lastZoned.toLocalDate().isBefore(now.toLocalDate());
            case WEEKLY -> !isSameIsoWeek(lastZoned, now);
            case MONTHLY -> lastZoned.getYear() < now.getYear()
                    || (lastZoned.getYear() == now.getYear() && lastZoned.getMonthValue() < now.getMonthValue());
            case CUSTOM -> isCustomBoundaryCrossed(task, lastZoned, now);
            case ONCE -> false;
        };
    }

    private boolean isSameIsoWeek(ZonedDateTime a, ZonedDateTime b) {
        LocalDate aMonday = a.toLocalDate().with(DayOfWeek.MONDAY);
        LocalDate bMonday = b.toLocalDate().with(DayOfWeek.MONDAY);
        return aMonday.equals(bMonday)
                && a.get(ChronoField.ALIGNED_WEEK_OF_YEAR) == b.get(ChronoField.ALIGNED_WEEK_OF_YEAR);
    }

    private boolean isCustomBoundaryCrossed(Task task, ZonedDateTime last, ZonedDateTime now) {
        Integer interval = task.getCustomIntervalValue();
        RecurrenceUnit unit = task.getCustomIntervalUnit();
        if (interval == null || interval <= 0 || unit == null) {
            return false;
        }
        ZonedDateTime next = switch (unit) {
            case DAY -> last.plusDays(interval);
            case WEEK -> last.plusWeeks(interval);
            case MONTH -> last.plusMonths(interval);
        };
        return !now.isBefore(next);
    }
}
