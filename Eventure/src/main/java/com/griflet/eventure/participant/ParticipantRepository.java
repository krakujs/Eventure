package com.griflet.eventure.participant;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ParticipantRepository extends MongoRepository<Participant, String> {
    List<Participant> findByEventId(String eventId);
}