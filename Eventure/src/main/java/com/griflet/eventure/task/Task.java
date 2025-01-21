package com.griflet.eventure.task;

import com.griflet.eventure.base.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Data
@Document(collection = "tasks")
@EqualsAndHashCode(callSuper = true)
public class Task extends BaseEntity {
    private String title;
    private String description;
    private Date dueDate;
    private String status;
    private String creatorId;
    private String eventId;
}
