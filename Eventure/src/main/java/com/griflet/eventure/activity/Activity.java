package com.griflet.eventure.activity;

import com.griflet.eventure.base.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "activities")
@EqualsAndHashCode(callSuper = true)
public class Activity extends BaseEntity {
    private String userId;
    private String description;
}

