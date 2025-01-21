package com.griflet.eventure.permission;

public enum SystemRole implements Role {
    USER("User", "Regular system user") {
        @Override
        protected void setupPermissions() {
            addPermission(Permission.READ_EVENT);
            addPermission(Permission.READ_TASK);
        }
    },
    ADMIN("Admin", "System administrator") {
        @Override
        protected void setupPermissions() {
            for (Permission permission : Permission.values()) {
                addPermission(permission);
            }
        }
    },
    EVENT_MANAGER("Event Manager", "Manages events in the system") {
        @Override
        protected void setupPermissions() {
            addPermission(Permission.READ_EVENT);
            addPermission(Permission.WRITE_EVENT);
            addPermission(Permission.DELETE_EVENT);
            addPermission(Permission.READ_TASK);
            addPermission(Permission.WRITE_TASK);
            addPermission(Permission.DELETE_TASK);
        }
    };

    private final BaseRole baseRole;

    SystemRole(String name, String description) {
        this.baseRole = new BaseRole(name, description) {
        };
        setupPermissions();
    }

    protected abstract void setupPermissions();

    @Override
    public String getName() {
        return baseRole.getName();
    }

    @Override
    public String getDescription() {
        return baseRole.getDescription();
    }

    @Override
    public PermissionSet getPermissions() {
        return baseRole.getPermissions();
    }

    @Override
    public boolean hasPermission(Permission permission) {
        return baseRole.hasPermission(permission);
    }

    protected void addPermission(Permission permission) {
        baseRole.addPermission(permission);
    }
}