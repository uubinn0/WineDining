package com.ssafy.winedining.domain.user.controller;

import com.ssafy.winedining.domain.user.dto.UserResponseDTO;
import com.ssafy.winedining.domain.user.service.UserService;
import com.ssafy.winedining.global.auth.dto.CustomOAuth2User;
import com.ssafy.winedining.global.common.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/user")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<UserResponseDTO>> getUserProfile(@AuthenticationPrincipal CustomOAuth2User customOAuth2User) {
        // 인증되지 않은 사용자 처리
        if (customOAuth2User == null) {
            throw new AuthenticationException("인증이 필요합니다.") {};
        }

        Long userId = customOAuth2User.getUserId();
        if (userId == null) {
            throw new IllegalArgumentException("유효하지 않은 사용자 ID입니다.");
        }

        UserResponseDTO profileDTO = userService.getUserProfile(userId);

        ApiResponse<UserResponseDTO> response = ApiResponse.<UserResponseDTO>builder()
                .status(HttpStatus.OK.value())
                .success(true)
                .message("내 정보 조회 성공")
                .data(profileDTO)
                .build();

        return ResponseEntity.ok(response);
    }
}