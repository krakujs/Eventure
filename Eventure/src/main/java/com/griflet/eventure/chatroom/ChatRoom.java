package com.griflet.eventure.chatroom;


import com.griflet.eventure.base.BaseEntity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Document;

@EqualsAndHashCode(callSuper = true)
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Document
public class ChatRoom extends BaseEntity {
    private String chatId;
    private String senderId;
    private String recipientId;
}
