package com.griflet.eventure.activity;

import com.griflet.eventure.base.BaseServiceImpl;
import com.griflet.eventure.messageTemplate.MessageTemplateProvider;
import com.griflet.eventure.user.UserService;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@AllArgsConstructor
public class ActivityServiceImpl extends BaseServiceImpl<Activity, ActivityDTO> implements ActivityService {
    private final ActivityRepository activityRepository;
    private final MessageTemplateProvider messageTemplateProvider;
    private final UserService userService;

    @Override
    public void logActivity(String actorId, EntityType entityType, ActionType actionType, String entityId,
            String entityName, Map<String, Object> additionalParams) {
        var template = messageTemplateProvider.getActivityTemplate(entityType, actionType);
        template.addParameter("actor", userService.findById(actorId).orElseThrow().getName())
                .addParameter("entityName", entityName);
        additionalParams.forEach(template::addParameter);

        logActivity(actorId, template.build());
    }

    @Override
    public void logActivity(String actionId, String description) {
        Activity activity = new Activity();
        activity.setUserId(SecurityContextHolder.getContext().getAuthentication().getName());
        activity.setDescription(description);
        activityRepository.save(activity);
    }

    @Override
    public Page<Activity> getRecentActivities(String userId, Pageable pageable) {
        return activityRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable);
    }

    @Override
    protected Class<Activity> getEntityClass() {
        return Activity.class;
    }
}
