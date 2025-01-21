package com.griflet.eventure.base;

import lombok.Data;

import java.util.Date;

@Data
public class BaseDTO {
    String id;
    Date createdAt;
    Date updatedAt;
}

