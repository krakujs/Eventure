package com.griflet.eventure.task;

import com.griflet.eventure.base.BaseServiceImpl;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class TaskServiceImpl extends BaseServiceImpl<Task, TaskDTO> implements TaskService {
    private final TaskRepository taskRepository;

    @Override
    protected Class<Task> getEntityClass() {
        return Task.class;
    }

    @Override
    public List<Task> getEventTask(String eventId) {
        return taskRepository.getTaskByEventId(eventId);
    }
}