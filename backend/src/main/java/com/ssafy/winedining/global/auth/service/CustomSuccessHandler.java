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
import java.net.URL;
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
        CustomOAuth2User customUserDetails = (CustomOAuth2User) authentication.getPrincipal();

        String username = customUserDetails.getUsername();
        Long userId = customUserDetails.getUserId();

        Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
        Iterator<? extends GrantedAuthority> iterator = authorities.iterator();
        GrantedAuthority auth = iterator.next();
        String role = auth.getAuthority();

        // 요청 헤더에서 원래 도메인 추출
        String requestDomain = request.getHeader("X-Forwarded-Host");
        if (requestDomain == null) {
            requestDomain = request.getHeader("Host");
        }
        if (requestDomain == null) {
            requestDomain = request.getServerName();
        }

        // 토큰 생성
        String token = jwtUtil.createJwt(username, role, userId, accessTokenExpiration);

        // 쿠키 생성 시 도메인 전달
        Cookie cookie = createCookie("Authorization", token, requestDomain);
        response.addCookie(cookie);

        // 동적 리다이렉트 URL 생성
        String redirectUrl = "https://" + requestDomain + "/home";
        response.sendRedirect(redirectUrl);

        System.out.println("Detected domain: " + requestDomain);
        System.out.println("X-Forwarded-Host: " + request.getHeader("X-Forwarded-Host"));
        System.out.println("Host Header: " + request.getHeader("Host"));
        System.out.println("Server Name: " + request.getServerName());
    }

    private Cookie createCookie(String key, String value, String domain) {
        Cookie cookie = new Cookie(key, value);
        cookie.setMaxAge((int)(accessTokenExpiration / 1000));

        // localhost가 아닌 경우 secure 설정
        if (!domain.equals("localhost")) {
            cookie.setSecure(true);
        }

        cookie.setPath("/");
        cookie.setHttpOnly(true);

        // localhost가 아닌 경우 도메인 설정
        if (!domain.equals("localhost")) {
            // 도메인 시작에 점(.)이 있으면 제거
            if (domain.startsWith(".")) {
                domain = domain.substring(1);
            }
            cookie.setDomain(domain);
        }

        return cookie;
    }
}