package com.griflet.eventure.permission;

import java.util.HashSet;
import java.util.Set;

public class PermissionSet {
    private final Set<Permission> permissions;

    public PermissionSet() {
        this.permissions = new HashSet<>();
    }

    public void addPermission(Permission permission) {
        permissions.add(permission);
    }

    public void removePermission(Permission permission) {
        permissions.remove(permission);
    }

    public boolean hasPermission(Permission permission) {
        return permissions.contains(permission);
    }

    public Set<Permission> getPermissions() {
        return new HashSet<>(permissions);
    }
}
