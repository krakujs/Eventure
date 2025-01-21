package com.griflet.eventure.security;

import com.griflet.eventure.user.UserDTO;
import com.griflet.eventure.user.UserService;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.oidc.user.DefaultOidcUser;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class AuthenticationSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {


    @Value("${app.oauth2.redirectUri}")
    private String redirectUri;

    private final JwtTokenProvider jwtTokenProvider;
    private final UserService userService;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
            Authentication authentication) throws IOException, ServletException {
        String token = jwtTokenProvider.generateToken(authentication);
        String targetUrl = redirectUri + "?token=" + token;
        if (authentication.getPrincipal() instanceof DefaultOidcUser defaultOidcUser
                && userService.findByEmail(defaultOidcUser.getEmail()) == null) {
            userService.save(UserDTO.builder().email(defaultOidcUser.getEmail())
                    .name(defaultOidcUser.getClaims().get("name").toString()).build());
        }
        getRedirectStrategy().sendRedirect(request, response, targetUrl);
    }
}