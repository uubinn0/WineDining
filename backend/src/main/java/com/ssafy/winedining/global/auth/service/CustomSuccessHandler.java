package com.ssafy.winedining.global.auth.service;

import com.ssafy.winedining.global.auth.dto.CustomOAuth2User;
import com.ssafy.winedining.global.jwt.JWTUtil;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Collection;
import java.util.Iterator;

@Component
public class CustomSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final JWTUtil jwtUtil;

    @Value("${jwt.access-token-expiration}")
    private long accessTokenExpiration;

    @Value("${frontend.url}")
    private String frontendUrl;

    @Value("${server.domain}")
    private String serverDomain;

    public CustomSuccessHandler(JWTUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        //OAuth2User
        CustomOAuth2User customUserDetails = (CustomOAuth2User) authentication.getPrincipal();

        String username = customUserDetails.getUsername();

        Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
        Iterator<? extends GrantedAuthority> iterator = authorities.iterator();
        GrantedAuthority auth = iterator.next();
        String role = auth.getAuthority();

        // 설정 파일의 만료 시간 사용
        String token = jwtUtil.createJwt(username, role, accessTokenExpiration);

        // 쿠키 만료 시간도 동일하게 설정 (초 단위로 변환 필요)
        response.addCookie(createCookie("Authorization", token));
        response.sendRedirect(frontendUrl);
    }

    private Cookie createCookie(String key, String value) {
        Cookie cookie = new Cookie(key, value);
        // 밀리초를 초로 변환 (쿠키의 maxAge는 초 단위)
        cookie.setMaxAge((int)(accessTokenExpiration / 1000));

        // 서버 도메인에 따라 secure 설정
        if (!serverDomain.equals("localhost")) {
            cookie.setSecure(true);
        }

        cookie.setPath("/");
        cookie.setHttpOnly(true);

        // 서버 도메인이 localhost가 아닐 경우 도메인 설정
        if (!serverDomain.equals("localhost")) {
            cookie.setDomain(serverDomain);
        }

        return cookie;
    }
}