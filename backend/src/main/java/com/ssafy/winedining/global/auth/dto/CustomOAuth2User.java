package com.ssafy.winedining.global.auth.dto;

import com.ssafy.winedining.domain.user.dto.UserDTO;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.core.user.OAuth2User;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Map;

public class CustomOAuth2User implements OAuth2User {

    private final UserDTO userDTO;

    public CustomOAuth2User(UserDTO userDTO) {
        this.userDTO = userDTO;
    }

    @Override
    public Map<String, Object> getAttributes() {
        return null;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        Collection<GrantedAuthority> collection = new ArrayList<>();
        collection.add(() -> userDTO.getRole());
        return collection;
    }

    @Override
    public String getName() {
        return userDTO.getName();
    }

    public String getUsername() {
        return userDTO.getUsername();
    }

    // UserId 정보 제공 메서드 추가
    public Long getUserId() {
        return userDTO.getId();
    }

    // Rank 정보 제공 메서드 추가
    public String getRankName() {
        return userDTO.getRankName();
    }
}