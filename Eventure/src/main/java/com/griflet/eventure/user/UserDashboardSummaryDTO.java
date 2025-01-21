package com.griflet.eventure.user;

import com.griflet.eventure.activity.ActivityDTO;
import com.griflet.eventure.event.EventDTO;
import com.griflet.eventure.notification.NotificationDTO;
import lombok.Data;
import org.springframework.data.domain.Page;

import java.util.List;

@Data
public class UserDashboardSummaryDTO {
    private Page<EventDTO> upcomingEvents;
    private List<NotificationDTO> recentNotifications;
    private Page<ActivityDTO> recentActivities;
}