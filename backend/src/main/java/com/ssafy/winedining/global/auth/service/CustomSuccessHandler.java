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
        //OAuth2User
        CustomOAuth2User customUserDetails = (CustomOAuth2User) authentication.getPrincipal();

        String username = customUserDetails.getUsername();
        Long userId = customUserDetails.getUserId();

        Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
        Iterator<? extends GrantedAuthority> iterator = authorities.iterator();
        GrantedAuthority auth = iterator.next();
        String role = auth.getAuthority();

        // 원래 요청 도메인 파악 (프록시 환경 고려)
        String requestDomain = request.getHeader("X-Forwarded-Host");
        if (requestDomain == null || requestDomain.isEmpty()) {
            requestDomain = request.getHeader("Host");
        }
        if (requestDomain == null || requestDomain.isEmpty()) {
            requestDomain = request.getServerName();
        }

        // Referer 헤더에서 도메인 추출 시도
        String referer = request.getHeader("Referer");
        if (referer != null && !referer.isEmpty()) {
            try {
                URL refererUrl = new URL(referer);
                requestDomain = refererUrl.getHost();
            } catch (Exception e) {
                // URL 파싱 오류 시 기존 도메인 유지
            }
        }

        System.out.println("Detected domain: " + requestDomain); // 디버깅용

        // 토큰 생성 및 쿠키 설정
        String token = jwtUtil.createJwt(username, role, userId, accessTokenExpiration);
        response.addCookie(createCookie("Authorization", token, requestDomain));

        // 리다이렉트 URL 설정 (프로토콜 추가)
        String redirectUrl = "https://" + requestDomain + "/home";
        System.out.println("Redirecting to: " + redirectUrl); // 디버깅용
        response.sendRedirect(redirectUrl);
    }

    // createCookie 메서드에 도메인 파라미터 추가
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
        // 도메인 시작에 점(.)이 있으면 제거
        if (!domain.equals("localhost")) {
            if (domain.startsWith(".")) {
                domain = domain.substring(1);
            }
            cookie.setDomain(domain);
            System.out.println("Setting cookie domain: " + domain); // 디버깅용
        }

        return cookie;
    }
}