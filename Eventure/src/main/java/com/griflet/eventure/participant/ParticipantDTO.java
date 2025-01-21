package com.griflet.eventure.participant;

import com.griflet.eventure.base.BaseDTO;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
public class ParticipantDTO extends BaseDTO {
    private String userId;
    private String eventId;
    private ParticipantRole role;
}