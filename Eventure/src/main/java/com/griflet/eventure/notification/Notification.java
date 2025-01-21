package com.griflet.eventure.notification;

import com.griflet.eventure.base.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "notifications")
@EqualsAndHashCode(callSuper = true)
public class Notification extends BaseEntity {
    private String userId;
    private String message;
    private boolean read;
    private String type;  // e.g., "EVENT_REMINDER" etc.
}