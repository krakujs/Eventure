package com.griflet.eventure.user;

import com.griflet.eventure.base.BaseEntity;
import com.griflet.eventure.permission.SystemRole;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "users")
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
public class User extends BaseEntity {
    private String name;
    @Indexed(unique = true)
    private String email;
    private SystemRole role;

}
