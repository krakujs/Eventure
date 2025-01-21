package com.griflet.eventure.user;

import com.griflet.eventure.activity.ActionType;
import com.griflet.eventure.base.BaseServiceImpl;
import com.griflet.eventure.notification.NotificationService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class UserServiceImpl extends BaseServiceImpl<User, UserDTO> implements UserService {
    private final UserRepository userRepository;


    protected NotificationService notificationService;

    @Override
    public void afterCreate(User user) {
        logActivityAndNotify(user, ActionType.CREATED);

    }

    @Override
    public void afterUpdate(User user) {
        logActivityAndNotify(user, ActionType.UPDATED);

    }

    @Override
    public void afterDelete(User user) {
        logActivityAndNotify(user, ActionType.DELETED);
    }

    @Override
    protected Class<User> getEntityClass() {
        return User.class;
    }

    private void logActivityAndNotify(User user, ActionType actionType) {
        //        notificationService.createNotification(user.getId(), EntityType.USER, actionType, user.getName(),
        //                params);

    }


    @Override
    public User findByEmail(String email) {
        return userRepository.findByEmail(email);
    }
}
