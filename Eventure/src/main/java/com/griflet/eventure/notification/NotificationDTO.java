package com.griflet.eventure.notification;

import com.griflet.eventure.base.BaseDTO;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.Date;

@EqualsAndHashCode(callSuper = true)
@Data
public class NotificationDTO extends BaseDTO {
    private String message;
    private Date createdAt;
    private boolean read;
    private String type;
}