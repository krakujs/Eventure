package com.griflet.eventure.task;

import com.griflet.eventure.permission.Permission;
import com.griflet.eventure.permission.RequirePermission;
import lombok.AllArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api")
@AllArgsConstructor
public class TaskController {

    private final TaskService taskService;
    private final ModelMapper modelMapper;

    @PostMapping("/event/{eventId}/task")
    @RequirePermission({ Permission.WRITE_TASK })
    public ResponseEntity<TaskDTO> create(@PathVariable String eventId, @RequestBody TaskDTO dto) {
        dto.setEventId(eventId);
        Task savedEntity = taskService.save(dto);
        return ResponseEntity.ok(modelMapper.map(savedEntity, TaskDTO.class));
    }

    @GetMapping("/event/{eventId}/tasks")
    public List<TaskDTO> getEventTask(@PathVariable String eventId) {
        return taskService.getEventTask(eventId).stream().map(e -> modelMapper.map(e, TaskDTO.class))
                .toList();
    }

    @GetMapping("/task/{id}")
    @RequirePermission({ Permission.READ_EVENT })
    public ResponseEntity<TaskDTO> getById(@PathVariable String id) {
        Optional<Task> entity = taskService.findById(id);
        return entity.map(e -> ResponseEntity.ok(modelMapper.map(e, TaskDTO.class)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/task/{id}")
    @RequirePermission({ Permission.WRITE_TASK })
    public ResponseEntity<TaskDTO> update(@PathVariable String id, @RequestBody TaskDTO dto) {
        Task updatedEntity = taskService.update(id, dto);
        return ResponseEntity.ok(modelMapper.map(updatedEntity, TaskDTO.class));
    }

    @DeleteMapping("/task/{id}")
    @RequirePermission({ Permission.DELETE_TASK })
    public ResponseEntity<Void> delete(@PathVariable String id) {
        taskService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

}