package com.griflet.eventure.user;

import com.griflet.eventure.base.BaseDTO;
import com.griflet.eventure.permission.SystemRole;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@EqualsAndHashCode(callSuper = true)
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserDTO extends BaseDTO {
    private String name;
    private String email;
    private SystemRole role;
}