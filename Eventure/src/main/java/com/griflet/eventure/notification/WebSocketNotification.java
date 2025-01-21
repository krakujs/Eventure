package com.griflet.eventure.notification;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class WebSocketNotification {
    private String id;
    private String type;
    private String message;
}