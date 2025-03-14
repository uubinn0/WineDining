package com.ssafy.winedining.global.auth.service;

import com.ssafy.winedining.domain.user.entity.User;
import com.ssafy.winedining.domain.user.service.UserReadService;
import com.ssafy.winedining.global.auth.dto.TokenDTO;
import com.ssafy.winedining.global.auth.entity.Auth;
import com.ssafy.winedining.global.auth.repository.AuthRepository;
import com.ssafy.winedining.global.exception.BaseException;
import com.ssafy.winedining.global.exception.ErrorCode;
import com.ssafy.winedining.global.util.JwtUtil;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Transactional
public class AuthService {

    private final JwtUtil jwtUtil;
    private final AuthRepository authRepository;
    private final UserReadService userReadService;

    @Value("${server.domain}")
    private String serverDomain;

    public void refreshToken(String refreshToken, HttpServletResponse response) {
        if (!jwtUtil.validateToken(refreshToken)) {
            throw new BaseException(ErrorCode.INVALID_TOKEN);
        }

        String email = jwtUtil.getEmailFromToken(refreshToken);
        User user = userReadService.findUserByEmailOrElseThrow(email);
        Auth savedAuth = authRepository.findByUser(user)
                .orElseThrow(() -> new BaseException(ErrorCode.INVALID_TOKEN));

        if (!savedAuth.getRefreshToken().equals(refreshToken)) {
            throw new BaseException(ErrorCode.INVALID_TOKEN);
        }

        TokenDTO newTokens = jwtUtil.generateTokens(email);
        updateRefreshToken(newTokens.getRefreshToken(), savedAuth);
        addRefreshTokenCookie(response, newTokens.getRefreshToken());
        addAccessTokenCookie(response, newTokens.getAccessToken());
    }

    public void updateRefreshToken(String refreshToken, Auth auth) {
        auth.updateToken(refreshToken, LocalDateTime.now().plusDays(14));
        authRepository.save(auth);
    }

    public void addAccessTokenCookie(HttpServletResponse response, String accessToken) {
        Cookie cookie = new Cookie("access_token", accessToken);
        cookie.setSecure(false); // true로 설정해야함
        cookie.setPath("/"); // / 이하 모든 경로에서 쿠키를 사용할 수 있음
        cookie.setDomain(serverDomain);
        cookie.setMaxAge(32400); // 9시간
        response.addCookie(cookie);
    }

    public void addRefreshTokenCookie(HttpServletResponse response, String refreshToken) {
        Cookie cookie = new Cookie("refresh_token", refreshToken);
        cookie.setHttpOnly(false); // true로 설정해야함
        cookie.setSecure(false); // true로 설정해야함
        cookie.setPath("/"); // / 이하 모든 경로에서 쿠키를 사용할 수 있음
        cookie.setMaxAge(14 * 24 * 60 * 60); // 14일
        cookie.setDomain(serverDomain); // 도메인 설정 추가
        response.addCookie(cookie);
    }

    @Transactional
    public void logout(Long userId) {
        authRepository.deleteByUser_UserId(userId);
    }
}