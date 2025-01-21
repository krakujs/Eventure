package com.griflet.eventure.task;

import com.griflet.eventure.base.BaseService;

import java.util.List;

public interface TaskService extends BaseService<Task, TaskDTO> {
    List<Task> getEventTask(String eventId);
}