package com.griflet.eventure.notification;

import com.griflet.eventure.activity.ActionType;
import com.griflet.eventure.activity.EntityType;
import com.griflet.eventure.base.BaseServiceImpl;
import com.griflet.eventure.messageTemplate.MessageTemplateProvider;
import lombok.AllArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class NotificationServiceImpl extends BaseServiceImpl<Notification, NotificationDTO>
        implements NotificationService {
    private final NotificationRepository notificationRepository;
    private final MessageTemplateProvider messageTemplateProvider;
    private final SimpMessagingTemplate messageTemplate;

    @Override
    public List<Notification> getRecentNotifications(String userId, int limit) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId).stream().limit(limit)
                .collect(Collectors.toList());
    }

    @Override
    public List<Notification> getUnreadNotifications(String userId) {
        return notificationRepository.findByUserIdAndReadOrderByCreatedAtDesc(userId, false);
    }

    @Override
    public void markAsRead(String notificationId) {
        notificationRepository.findById(notificationId).ifPresent(notification -> {
            notification.setRead(true);
            notificationRepository.save(notification);
        });
    }


    public void createNotification(String userId, EntityType entityType, ActionType actionType,
            String entityName, Map<String, Object> additionalParams) {
        var template = messageTemplateProvider.getNotificationTemplate(entityType, actionType);
        template.addParameter("entityName", entityName);
        additionalParams.forEach(template::addParameter);

        String message = template.build();
        String type = entityType.name() + "_" + actionType.name();

        // Persist the notification
        Notification notification = new Notification();
        notification.setUserId(userId);
        notification.setMessage(message);
        notification.setType(type);
        notificationRepository.save(notification);

        // Send the notification via WebSocket
        sendNotificationToUser(userId, new WebSocketNotification(notification.getId(), type, message));
    }

    public void sendNotificationToAllUsers(String type, String message) {
        WebSocketNotification notification = new WebSocketNotification(null, type, message);
        messageTemplate.convertAndSend("/topic/notifications", notification);
    }


    private void sendNotificationToUser(String userId, WebSocketNotification notification) {
        messageTemplate.convertAndSendToUser(userId, "/queue/notifications", notification);
    }


    @Override
    protected Class<Notification> getEntityClass() {
        return Notification.class;
    }
}