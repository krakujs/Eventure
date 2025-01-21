package com.griflet.eventure.permission;

import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.springframework.stereotype.Component;

@Aspect
@Component
public class PermissionAspect {

    private final PermissionChecker permissionChecker;

    public PermissionAspect(PermissionChecker permissionChecker) {
        this.permissionChecker = permissionChecker;
    }

    @Before("@annotation(requirePermission)")
    public void checkPermission(RequirePermission requirePermission) {
        //        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        //        if (!permissionChecker.hasAnyPermission(user, requirePermission.value())) {
        //            throw new SecurityException("User does not have the required permissions");
        //        }
    }
}
