package com.griflet.eventure.event;

import com.griflet.eventure.base.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Data
@Document(collection = "events")
@EqualsAndHashCode(callSuper = true)
public class Event extends BaseEntity {
    private String title;
    private String description;
    private Date date;
    private String location;
    private String creatorId;
}