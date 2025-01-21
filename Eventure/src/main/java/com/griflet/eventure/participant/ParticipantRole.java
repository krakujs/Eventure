package com.griflet.eventure.participant;

import com.griflet.eventure.permission.BaseRole;
import com.griflet.eventure.permission.Permission;
import com.griflet.eventure.permission.PermissionSet;
import com.griflet.eventure.permission.Role;

public enum ParticipantRole implements Role {
    ATTENDEE("Attendee", "Participant in the event") {
        @Override
        protected void setupPermissions() {
            addPermission(Permission.READ_EVENT);
        }
    },
    SPEAKER("Speaker", "Presents at the event") {
        @Override
        protected void setupPermissions() {
            addPermission(Permission.READ_EVENT);
            addPermission(Permission.READ_TASK);
        }
    },
    ORGANIZER("Organizer", "Organizes and manages the event") {
        @Override
        protected void setupPermissions() {
            addPermission(Permission.READ_EVENT);
            addPermission(Permission.WRITE_EVENT);
            addPermission(Permission.READ_TASK);
            addPermission(Permission.WRITE_TASK);
        }
    };

    private final BaseRole baseRole;

    ParticipantRole(String name, String description) {
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
