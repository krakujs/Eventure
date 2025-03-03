package com.griflet.eventure.chat;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class WebSocketChatNotification {
    private String id;
    private String senderId;
    private String recipientId;
    private String content;
}