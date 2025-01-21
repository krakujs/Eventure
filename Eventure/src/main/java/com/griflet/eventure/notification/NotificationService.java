package com.griflet.eventure.notification;

import com.griflet.eventure.activity.ActionType;
import com.griflet.eventure.activity.EntityType;
import com.griflet.eventure.base.BaseService;

import java.util.List;
import java.util.Map;

public interface NotificationService extends BaseService<Notification, NotificationDTO> {
    List<Notification> getRecentNotifications(String userId, int limit);

    List<Notification> getUnreadNotifications(String userId);

    void markAsRead(String notificationId);


    void createNotification(String userId, EntityType entityType, ActionType actionType, String entityName,
            Map<String, Object> additionalParams);

    void sendNotificationToAllUsers(String newEvent, String notificationMessage);
}