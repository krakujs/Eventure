package com.griflet.eventure.chat;

import com.griflet.eventure.base.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;



@Data
@Document(collection = "chat_messages")
@EqualsAndHashCode(callSuper = true)
public class ChatMessage extends BaseEntity {
    private String chatId;
    private String senderId;
    private String recipientId;
    private String content;
    private Date timestamp;

}
