package com.griflet.eventure.permission;

public interface Role {
    String getName();

    String getDescription();

    PermissionSet getPermissions();

    boolean hasPermission(Permission permission);
}
