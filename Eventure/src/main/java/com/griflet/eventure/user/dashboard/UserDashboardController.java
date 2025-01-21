package com.griflet.eventure.user.dashboard;

import com.griflet.eventure.activity.Activity;
import com.griflet.eventure.activity.ActivityDTO;
import com.griflet.eventure.activity.ActivityService;
import com.griflet.eventure.event.Event;
import com.griflet.eventure.event.EventDTO;
import com.griflet.eventure.event.EventService;
import com.griflet.eventure.notification.Notification;
import com.griflet.eventure.notification.NotificationDTO;
import com.griflet.eventure.notification.NotificationService;
import com.griflet.eventure.user.UserDashboardSummaryDTO;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/user-dashboard")
@RequiredArgsConstructor
public class UserDashboardController {

    private final EventService eventService;
    private final NotificationService notificationService;
    private final ActivityService activityService;
    private final ModelMapper modelMapper;

    @GetMapping("/{userId}/upcoming-events")
    public ResponseEntity<Page<EventDTO>> getUpcomingEvents(@PathVariable String userId, Pageable pageable) {
        Page<Event> upcomingEvents = eventService.findUpcomingEvents(userId, pageable);
        Page<EventDTO> eventDTOs = upcomingEvents.map(event -> modelMapper.map(event, EventDTO.class));
        return ResponseEntity.ok(eventDTOs);
    }

    @GetMapping("/{userId}/notifications")
    public ResponseEntity<List<NotificationDTO>> getRecentNotifications(@PathVariable String userId,
            @RequestParam(defaultValue = "10") int limit) {
        List<Notification> notifications = notificationService.getRecentNotifications(userId, limit);
        List<NotificationDTO> notificationDTOs = notifications.stream()
                .map(notification -> modelMapper.map(notification, NotificationDTO.class))
                .collect(Collectors.toList());
        return ResponseEntity.ok(notificationDTOs);
    }

    @GetMapping("/{userId}/activities")
    public ResponseEntity<Page<ActivityDTO>> getRecentActivities(@PathVariable String userId,
            Pageable pageable) {
        Page<Activity> activities = activityService.getRecentActivities(userId, pageable);
        Page<ActivityDTO> activityDTOs =
                activities.map(activity -> modelMapper.map(activity, ActivityDTO.class));
        return ResponseEntity.ok(activityDTOs);
    }

    @GetMapping("/{userId}/summary")
    public ResponseEntity<UserDashboardSummaryDTO> getDashboardSummary(@PathVariable String userId) {
        UserDashboardSummaryDTO summary = new UserDashboardSummaryDTO();

        // Fetch upcoming events
        Page<Event> upcomingEvents = eventService.findUpcomingEvents(userId, Pageable.ofSize(5));
        summary.setUpcomingEvents(upcomingEvents.map(event -> modelMapper.map(event, EventDTO.class)));

        // Fetch recent notifications
        List<Notification> recentNotifications = notificationService.getRecentNotifications(userId, 5);
        summary.setRecentNotifications(recentNotifications.stream()
                .map(notification -> modelMapper.map(notification, NotificationDTO.class))
                .collect(Collectors.toList()));

        // Fetch recent activities
        Page<Activity> recentActivities = activityService.getRecentActivities(userId, Pageable.ofSize(5));
        summary.setRecentActivities(
                recentActivities.map(activity -> modelMapper.map(activity, ActivityDTO.class)));

        return ResponseEntity.ok(summary);
    }
}