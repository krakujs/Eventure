package com.griflet.eventure.activity;

import com.griflet.eventure.base.BaseService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Map;

public interface ActivityService extends BaseService<Activity, ActivityDTO> {
    void logActivity(String actorId, EntityType entityType, ActionType actionType, String entityId,
            String entityName, Map<String, Object> additionalParams);

    void logActivity(String actionId, String description);

    Page<Activity> getRecentActivities(String userId, Pageable pageable);
}