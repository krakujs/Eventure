package com.griflet.eventure.permission;

import com.griflet.eventure.user.User;
import org.springframework.stereotype.Component;

@Component
public class PermissionChecker {

    public boolean hasPermission(User user, Permission permission) {
        return user.getRole().hasPermission(permission);
    }

    public boolean hasAnyPermission(User user, Permission... permissions) {
        for (Permission permission : permissions) {
            if (hasPermission(user, permission)) {
                return true;
            }
        }
        return false;
    }

    public boolean hasAllPermissions(User user, Permission... permissions) {
        for (Permission permission : permissions) {
            if (!hasPermission(user, permission)) {
                return false;
            }
        }
        return true;
    }
}