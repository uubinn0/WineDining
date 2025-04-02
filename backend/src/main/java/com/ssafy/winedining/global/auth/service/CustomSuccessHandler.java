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

//    @Value("${frontend.url}")
//    private String frontendUrl;
//
//    @Value("${server.domain}")
//    private String serverDomain;

    public CustomSuccessHandler(JWTUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        //OAuth2User
        CustomOAuth2User customUserDetails = (CustomOAuth2User) authentication.getPrincipal();

        String username = customUserDetails.getUsername();
        Long userId = customUserDetails.getUserId();

        Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
        Iterator<? extends GrantedAuthority> iterator = authorities.iterator();
        GrantedAuthority auth = iterator.next();
        String role = auth.getAuthority();

        // 현재 요청 도메인 가져오기
        String requestDomain = request.getServerName();

        // userId를 포함한 토큰 생성
        String token = jwtUtil.createJwt(username, role, userId, accessTokenExpiration);

        // 현재 요청 도메인 기반으로 쿠키 생성
        response.addCookie(createCookie("Authorization", token, requestDomain));

        // 동일한 도메인으로 리다이렉트
        String redirectUrl = "https://" + requestDomain + "/home";
        response.sendRedirect(redirectUrl);
    }

    // createCookie 메서드에 도메인 파라미터 추가
    private Cookie createCookie(String key, String value, String domain) {
        Cookie cookie = new Cookie(key, value);
        // 밀리초를 초로 변환 (쿠키의 maxAge는 초 단위)
        cookie.setMaxAge((int)(accessTokenExpiration / 1000));

        // localhost가 아닌 경우 secure 설정
        if (!domain.equals("localhost")) {
            cookie.setSecure(true);
        }

        cookie.setPath("/");
        cookie.setHttpOnly(true);

        // localhost가 아닌 경우 도메인 설정
        if (!domain.equals("localhost")) {
            cookie.setDomain(domain);
        }

        return cookie;
    }
}