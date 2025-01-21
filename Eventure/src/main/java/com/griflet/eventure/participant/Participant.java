package com.griflet.eventure.participant;

import com.griflet.eventure.base.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "participants")
@EqualsAndHashCode(callSuper = true)
public class Participant extends BaseEntity {
    private String userId;
    private String eventId;
    private ParticipantRole role;
}