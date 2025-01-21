package com.griflet.eventure.participant;

import com.griflet.eventure.activity.ActionType;
import com.griflet.eventure.activity.ActivityService;
import com.griflet.eventure.activity.EntityType;
import com.griflet.eventure.base.BaseServiceImpl;
import com.griflet.eventure.event.Event;
import com.griflet.eventure.event.EventService;
import com.griflet.eventure.notification.NotificationService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
@AllArgsConstructor
public class ParticipantServiceImpl extends BaseServiceImpl<Participant, ParticipantDTO>
        implements ParticipantService {
    private final ParticipantRepository participantRepository;
    private final EventService eventService;
    protected ActivityService activityService;
    protected NotificationService notificationService;

    @Override
    public void afterCreate(Participant participant) {
        Event event = eventService.findById(participant.getEventId()).orElseThrow();
        logActivityAndNotify(participant, event, ActionType.CREATED);
    }

    @Override
    public void afterUpdate(Participant participant) {
        Event event = eventService.findById(participant.getEventId()).orElseThrow();
        logActivityAndNotify(participant, event, ActionType.UPDATED);
    }

    @Override
    public void afterDelete(Participant participant) {
        Event event = eventService.findById(participant.getEventId()).orElseThrow();
        logActivityAndNotify(participant, event, ActionType.DELETED);
    }

    @Override
    protected Class<Participant> getEntityClass() {
        return Participant.class;
    }

    private void logActivityAndNotify(Participant participant, Event event, ActionType actionType) {
        Map<String, Object> params =
                Map.of("eventName", event.getTitle(), "role", participant.getRole().getName());

        activityService.logActivity(participant.getUserId(), EntityType.PARTICIPANT, actionType,
                participant.getId(), event.getTitle(), params);
        notificationService.createNotification(participant.getUserId(), EntityType.PARTICIPANT, actionType,
                event.getTitle(), params);
        notificationService.createNotification(event.getCreatorId(), EntityType.PARTICIPANT, actionType,
                event.getTitle(), params);
    }

    @Override
    public List<Participant> findByEventId(String id) {
        return participantRepository.findByEventId(id);
    }
}
