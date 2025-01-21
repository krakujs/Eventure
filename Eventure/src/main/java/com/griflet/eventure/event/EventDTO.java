package com.griflet.eventure.event;

import com.griflet.eventure.base.BaseDTO;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.Date;

@EqualsAndHashCode(callSuper = true)
@Data
public class EventDTO extends BaseDTO {
    private String title;
    private String description;
    private Date date;
    private String location;
    private String creatorId;
}