package com.griflet.eventure.participant;

import com.griflet.eventure.base.BaseService;

import java.util.List;

public interface ParticipantService extends BaseService<Participant, ParticipantDTO> {
    List<Participant> findByEventId(String id);

}
