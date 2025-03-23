package com.ssafy.winedining.global.auth.controller;

import com.ssafy.winedining.global.auth.dto.CustomOAuth2User;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/test")
public class TestController {

    @GetMapping("/auth")
    public ResponseEntity<String> testAuth(Authentication authentication) {
        // Principal에서 CustomOAuth2User로 캐스팅
        if (authentication.getPrincipal() instanceof CustomOAuth2User) {
            CustomOAuth2User user = (CustomOAuth2User) authentication.getPrincipal();
            // getUsername() 메서드 호출하여 사용자명 가져오기
            String username = user.getUsername();
            return ResponseEntity.ok("인증 성공! 사용자명: " + username);
        }
        return ResponseEntity.ok("인증 성공! 타입: " + authentication.getPrincipal().getClass().getName());
    }

    @GetMapping("/token")
    public String testToken(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        StringBuilder result = new StringBuilder("쿠키 정보:\n");

        if (cookies != null) {
            for (Cookie cookie : cookies) {
                result.append(cookie.getName()).append(": ").append(cookie.getValue()).append("\n");
            }
        } else {
            result.append("쿠키가 없습니다.");
        }

        return result.toString();
    }
}