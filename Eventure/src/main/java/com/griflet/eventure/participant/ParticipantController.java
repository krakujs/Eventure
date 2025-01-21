package com.griflet.eventure.participant;

import lombok.AllArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/event/{eventId}")
@AllArgsConstructor
public class ParticipantController {

    private final ParticipantService participantService;
    private final ModelMapper modelMapper;

    @PostMapping("/participant")
    public ResponseEntity<ParticipantDTO> create(@PathVariable String eventId,
            @RequestBody ParticipantDTO dto) {
        dto.setEventId(eventId);
        Participant savedEntity = participantService.save(dto);
        return ResponseEntity.ok(modelMapper.map(savedEntity, ParticipantDTO.class));
    }

    @GetMapping("/participants")
    public List<ParticipantDTO> getbyEventId(@PathVariable String eventId) {
        return participantService.findByEventId(eventId).stream()
                .map(e -> modelMapper.map(e, ParticipantDTO.class)).toList();
    }

}
