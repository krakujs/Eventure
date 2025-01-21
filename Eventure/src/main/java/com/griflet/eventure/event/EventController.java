package com.griflet.eventure.event;

import com.griflet.eventure.permission.Permission;
import com.griflet.eventure.permission.RequirePermission;
import com.griflet.eventure.search.SearchCriteria;
import lombok.AllArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/events")
@AllArgsConstructor
public class EventController {
    private EventService eventService;
    private ModelMapper modelMapper;

    @PostMapping
    @RequirePermission(Permission.WRITE_EVENT)
    public ResponseEntity<EventDTO> create(@RequestBody EventDTO dto) {
        Event savedEntity = eventService.save(dto);
        return ResponseEntity.ok(modelMapper.map(savedEntity, EventDTO.class));
    }

    @GetMapping("/{id}")
    @RequirePermission(Permission.READ_EVENT)
    public ResponseEntity<EventDTO> getById(@PathVariable String id) {
        Optional<Event> entity = eventService.findById(id);
        return entity.map(e -> ResponseEntity.ok(modelMapper.map(e, EventDTO.class)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/{id}")
    @RequirePermission(Permission.WRITE_EVENT)
    public ResponseEntity<EventDTO> update(@PathVariable String id, @RequestBody EventDTO dto) {
        Event updatedEntity = eventService.update(id, dto);
        return ResponseEntity.ok(modelMapper.map(updatedEntity, EventDTO.class));
    }

    @DeleteMapping("/{id}")
    @RequirePermission(Permission.DELETE_EVENT)
    public ResponseEntity<Void> delete(@PathVariable String id) {
        eventService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/search")
    @RequirePermission(Permission.READ_EVENT)
    public ResponseEntity<Page<EventDTO>> searchEvents(@RequestBody List<SearchCriteria> searchCriteria,
            @RequestParam Pageable pageable) {
        Page<Event> events = eventService.search(searchCriteria, pageable);
        Page<EventDTO> eventDTOs = events.map(event -> modelMapper.map(event, EventDTO.class));
        return ResponseEntity.ok(eventDTOs);
    }
}