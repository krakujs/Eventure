package com.griflet.eventure.task;

import com.griflet.eventure.base.BaseDTO;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.Date;

@EqualsAndHashCode(callSuper = true)
@Data
public class TaskDTO extends BaseDTO {
    private String title;
    private String description;
    private Date dueDate;
    private String status;
    private String creatorId;
    private String eventId;
}
