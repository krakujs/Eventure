package com.griflet.eventure.activity;

import com.griflet.eventure.base.BaseDTO;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
public class ActivityDTO extends BaseDTO {
    private String description;
}