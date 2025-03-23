package com.ssafy.winedining.global.auth.controller;

import com.ssafy.winedining.global.auth.dto.CustomOAuth2User;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
public class CustomAuthController {
    @Value("${frontend.url}")
    private String frontendUrl;

    @Value("${server.domain}")
    private String serverDomain;

    @GetMapping("/oauth2/authorization/kakao")
    public void redirectToKakaoLogin(HttpServletResponse response) throws IOException {
        response.sendRedirect("/oauth2/authorization/kakao");
    }

    @GetMapping("/oauth2/authorization/google")
    public void redirectToGoogleLogin(HttpServletResponse response) throws IOException {
        response.sendRedirect("/oauth2/authorization/google");
    }

    @PostMapping("/logout")
    public ResponseEntity<Map<String, String>> logout(HttpServletResponse response) {
        // 인증 쿠키 삭제
        Cookie cookie = new Cookie("Authorization", null);
        cookie.setMaxAge(0);
        cookie.setPath("/");
        cookie.setHttpOnly(true);

        // 서버 도메인이 localhost가 아닐 경우 secure 및 도메인 설정
        if (!serverDomain.equals("localhost")) {
            cookie.setSecure(true);
            cookie.setDomain(serverDomain);
        }

        response.addCookie(cookie);

        // 성공 메시지와 리다이렉트 URL 반환
        Map<String, String> responseBody = new HashMap<>();
        responseBody.put("message", "로그아웃 성공");
        responseBody.put("redirectUrl", "/oauth2/authorization/kakao");

        return ResponseEntity.ok(responseBody);
    }

    // 현재 인증 상태 확인용 API
    @GetMapping("/status")
    public ResponseEntity<Map<String, Object>> authStatus(Authentication authentication) {
        Map<String, Object> response = new HashMap<>();

        if (authentication != null && authentication.isAuthenticated() &&
                !(authentication instanceof AnonymousAuthenticationToken)) {
            response.put("authenticated", true);

            if (authentication.getPrincipal() instanceof CustomOAuth2User) {
                CustomOAuth2User user = (CustomOAuth2User) authentication.getPrincipal();
                response.put("username", user.getUsername());
            }
        } else {
            response.put("authenticated", false);
        }

        return ResponseEntity.ok(response);
    }
}
