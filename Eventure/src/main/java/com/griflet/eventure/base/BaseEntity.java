package com.griflet.eventure.base;

import lombok.Data;
import org.springframework.data.annotation.Id;

import java.util.Date;
import java.util.Objects;

@Data
public abstract class BaseEntity {
    @Id
    protected String id;
    protected Date createdAt;
    protected Date updatedAt;

    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (!(o instanceof BaseEntity that))
            return false;

        return Objects.equals(getId(), that.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }
}