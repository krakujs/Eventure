package com.griflet.eventure.activity;

import lombok.Getter;

@Getter
public enum ActionType {
    CREATED("Created"),
    UPDATED("Updated"),
    DELETED("Deleted"),
    JOINED("Joined"),
    LEFT("Left");

    private final String displayName;

    ActionType(String displayName) {
        this.displayName = displayName;
    }

}
