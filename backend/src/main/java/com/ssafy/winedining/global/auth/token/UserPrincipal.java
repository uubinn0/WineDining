package com.ssafy.winedining.global.auth.token;

import com.ssafy.winedining.domain.user.entity.User;
import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.core.user.OAuth2User;

import java.util.Collection;
import java.util.Collections;
import java.util.Map;

@Getter
public class UserPrincipal implements OAuth2User {

    private final User user;
    private final Collection<? extends GrantedAuthority> authorities;
    private final OAuth2User oauth2User;

    // JWT 인증용 생성자
    public UserPrincipal(Collection<? extends GrantedAuthority> authorities, User user) {
        System.out.println("JWT로 인증!!");
        this.authorities = authorities;
        this.user = user;
        this.oauth2User = null;
    }

    // OAuth2 인증용 생성자
    public UserPrincipal(OAuth2User oauth2User, User user) {
        System.out.println("OAuth로 인증!!");
        this.oauth2User = oauth2User;
        this.user = user;
        this.authorities = oauth2User.getAuthorities();
    }

    @Override
    public Map<String, Object> getAttributes() {
        return oauth2User != null ? oauth2User.getAttributes() : Collections.emptyMap();
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public String getName() {
        return oauth2User != null ? oauth2User.getName() : user.getUserName();
    }

    public String getEmail() {
        return user.getEmail();
    }

    public Integer getUserId() {
        return user.getUserId();
    }

    public String getLastName() { return user.getLastName(); }

    public String getFirstName() { return user.getFirstName(); }
}