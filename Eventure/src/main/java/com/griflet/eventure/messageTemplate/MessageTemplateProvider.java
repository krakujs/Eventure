package com.griflet.eventure.messageTemplate;

import com.griflet.eventure.activity.ActionType;
import com.griflet.eventure.activity.EntityType;
import org.springframework.stereotype.Component;

import java.util.EnumMap;
import java.util.Map;

@Component
public class MessageTemplateProvider {
    private final Map<EntityType, Map<ActionType, String>> activityTemplates =
            new EnumMap<>(EntityType.class);
    private final Map<EntityType, Map<ActionType, String>> notificationTemplates =
            new EnumMap<>(EntityType.class);

    public MessageTemplateProvider() {
        initializeTemplates();
    }

    private void initializeTemplates() {
        // Event templates
        addActivityTemplate(EntityType.EVENT, ActionType.CREATED, "{actor} created event: {entityName}");
        addActivityTemplate(EntityType.EVENT, ActionType.UPDATED, "{actor} updated event: {entityName}");
        addActivityTemplate(EntityType.EVENT, ActionType.DELETED, "{actor} deleted event: {entityName}");

        addNotificationTemplate(EntityType.EVENT, ActionType.CREATED, "You created event: {entityName}");
        addNotificationTemplate(EntityType.EVENT, ActionType.UPDATED, "You updated event: {entityName}");
        addNotificationTemplate(EntityType.EVENT, ActionType.DELETED, "You deleted event: {entityName}");

        // Task templates
        addActivityTemplate(EntityType.TASK, ActionType.CREATED,
                "{actor} created task: {entityName} for event: {eventName}");
        addActivityTemplate(EntityType.TASK, ActionType.UPDATED,
                "{actor} updated task: {entityName} for event: {eventName}");
        addActivityTemplate(EntityType.TASK, ActionType.DELETED,
                "{actor} deleted task: {entityName} from event: {eventName}");

        addNotificationTemplate(EntityType.TASK, ActionType.CREATED,
                "You created task: {entityName} for event: {eventName}");
        addNotificationTemplate(EntityType.TASK, ActionType.UPDATED,
                "You updated task: {entityName} for event: {eventName}");
        addNotificationTemplate(EntityType.TASK, ActionType.DELETED,
                "You deleted task: {entityName} from event: {eventName}");

        // Participant templates
        addActivityTemplate(EntityType.PARTICIPANT, ActionType.CREATED,
                "{actor} joined event: {eventName} as {role}");
        addActivityTemplate(EntityType.PARTICIPANT, ActionType.UPDATED,
                "{actor} updated role to {role} for event: {eventName}");
        addActivityTemplate(EntityType.PARTICIPANT, ActionType.DELETED,
                "{actor} removed from event: {eventName}");

        addNotificationTemplate(EntityType.PARTICIPANT, ActionType.CREATED,
                "You joined event: {eventName} as {role}");
        addNotificationTemplate(EntityType.PARTICIPANT, ActionType.UPDATED,
                "Your role was updated to {role} for event: {eventName}");
        addNotificationTemplate(EntityType.PARTICIPANT, ActionType.DELETED, "You left event: {eventName}");

        // User templates
        addActivityTemplate(EntityType.USER, ActionType.CREATED, "New user registered: {entityName}");
        addActivityTemplate(EntityType.USER, ActionType.UPDATED, "User updated profile: {entityName}");
        addActivityTemplate(EntityType.USER, ActionType.DELETED, "User account deleted: {entityName}");

        addNotificationTemplate(EntityType.USER, ActionType.CREATED,
                "Welcome to the platform, {entityName}!");
        addNotificationTemplate(EntityType.USER, ActionType.UPDATED,
                "Your profile has been updated, {entityName}");
    }


    public void addActivityTemplate(EntityType entityType, ActionType actionType, String template) {
        activityTemplates.computeIfAbsent(entityType, k -> new EnumMap<>(ActionType.class))
                .put(actionType, template);
    }

    public void addNotificationTemplate(EntityType entityType, ActionType actionType, String template) {
        notificationTemplates.computeIfAbsent(entityType, k -> new EnumMap<>(ActionType.class))
                .put(actionType, template);
    }

    public MessageTemplate getActivityTemplate(EntityType entityType, ActionType actionType) {
        String template = activityTemplates.getOrDefault(entityType, Map.of()).get(actionType);
        if (template == null) {
            throw new IllegalArgumentException(
                    "No activity template found for entity type: " + entityType + " and action type: "
                            + actionType);
        }
        return new MessageTemplate(template);
    }

    public MessageTemplate getNotificationTemplate(EntityType entityType, ActionType actionType) {
        String template = notificationTemplates.getOrDefault(entityType, Map.of()).get(actionType);
        if (template == null) {
            throw new IllegalArgumentException(
                    "No notification template found for entity type: " + entityType + " and action type: "
                            + actionType);
        }
        return new MessageTemplate(template);
    }
}