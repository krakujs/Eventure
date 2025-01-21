package com.griflet.eventure.permission;

import lombok.Getter;

@Getter
public abstract class BaseRole implements Role {
    private final String name;
    private final String description;
    private final PermissionSet permissions;

    protected BaseRole(String name, String description) {
        this.name = name;
        this.description = description;
        this.permissions = new PermissionSet();
    }

    @Override
    public boolean hasPermission(Permission permission) {
        return permissions.hasPermission(permission);
    }

    public void addPermission(Permission permission) {
        permissions.addPermission(permission);
    }

}
