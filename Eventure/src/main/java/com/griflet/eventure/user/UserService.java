package com.griflet.eventure.user;

import com.griflet.eventure.base.BaseService;

public interface UserService extends BaseService<User, UserDTO> {
    User findByEmail(String email);
}