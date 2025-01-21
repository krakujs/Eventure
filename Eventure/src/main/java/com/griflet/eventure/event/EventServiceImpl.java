package com.griflet.eventure.event;

import com.griflet.eventure.activity.ActionType;
import com.griflet.eventure.activity.ActivityService;
import com.griflet.eventure.activity.EntityType;
import com.griflet.eventure.base.BaseServiceImpl;
import com.griflet.eventure.messageTemplate.MessageTemplateProvider;
import com.griflet.eventure.notification.NotificationService;
import com.griflet.eventure.participant.Participant;
import com.griflet.eventure.participant.ParticipantService;
import com.griflet.eventure.user.UserService;
import org.springframework.context.annotation.Lazy;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Map;

@Service
public class EventServiceImpl extends BaseServiceImpl<Event, EventDTO> implements EventService {
    private final EventRepository eventRepository;
    private final ParticipantService participantService;
    private final MessageTemplateProvider messageTemplateProvider;
    private final ActivityService activityService;
    private final NotificationService notificationService;
    private final UserService userService;

    public EventServiceImpl(EventRepository eventRepository, @Lazy ParticipantService participantService,
            MessageTemplateProvider messageTemplateProvider, ActivityService activityService,
            NotificationService notificationService, UserService userService) {
        this.eventRepository = eventRepository;
        this.participantService = participantService;
        this.messageTemplateProvider = messageTemplateProvider;
        this.activityService = activityService;
        this.notificationService = notificationService;
        this.userService = userService;
    }

    @Override
    protected Class<Event> getEntityClass() {
        return Event.class;
    }

    @Override
    public Page<Event> findUpcomingEvents(String userId, Pageable pageable) {
        return eventRepository.findByCreatorIdAndDateAfterOrderByDateAsc(userId, new Date(), pageable);
    }

    @Override
    public void afterCreate(Event event) {
        logActivityAndNotify(event, ActionType.CREATED);
    }

    @Override
    public void afterUpdate(Event event) {
        logActivityAndNotify(event, ActionType.UPDATED);
    }

    @Override
    public void afterDelete(Event event) {
        logActivityAndNotify(event, ActionType.DELETED);
    }

    private void logActivityAndNotify(Event event, ActionType actionType) {
        Map<String, Object> params =
                Map.of("entityName", event.getTitle(), "eventDate", event.getDate().toString(), "location",
                        event.getLocation());

        activityService.logActivity(event.getCreatorId(), EntityType.EVENT, actionType, event.getId(),
                event.getTitle(), params);

        // Notify participants (for update and delete actions)
        if (actionType != ActionType.CREATED) {
            notifyParticipants(event, actionType);
        }

        // Optionally, for created events, we could notify users who might be interested
        if (actionType == ActionType.CREATED) {
            notifyInterestedUsers(event);
        }
    }

    private void notifyParticipants(Event event, ActionType actionType) {
        List<Participant> participants = participantService.findByEventId(event.getId());
        for (Participant participant : participants) {
            if (!participant.getUserId().equals(event.getCreatorId())) {  // Don't notify creator twice
                Map<String, Object> params =
                        Map.of("entityName", event.getTitle(), "eventDate", event.getDate().toString(),
                                "location", event.getLocation(), "role", participant.getRole().getName());
                notifyUser(participant.getUserId(), event, actionType, params);
            }
        }
    }

    private void notifyUser(String userId, Event event, ActionType actionType, Map<String, Object> params) {
        notificationService.createNotification(userId, EntityType.EVENT, actionType, event.getTitle(),
                params);
    }

    private void notifyInterestedUsers(Event event) {
        // This is a placeholder. In a real application, you'd have a way to determine interested users.
        var notificationTemplate =
                messageTemplateProvider.getNotificationTemplate(EntityType.EVENT, ActionType.CREATED);
        notificationTemplate.addParameter("entityName", event.getTitle());
        notificationTemplate.addParameter("eventDate", event.getDate().toString());
        notificationTemplate.addParameter("location", event.getLocation());
        String notificationMessage = notificationTemplate.build();

        notificationService.sendNotificationToAllUsers("NEW_EVENT", notificationMessage);
    }
}
