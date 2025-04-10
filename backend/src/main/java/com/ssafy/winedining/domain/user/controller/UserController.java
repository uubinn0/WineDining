package com.ssafy.winedining.domain.user.controller;

import com.ssafy.winedining.domain.user.dto.ProfileUpdateRequestDTO;
import com.ssafy.winedining.domain.user.dto.UserResponseDTO;
import com.ssafy.winedining.domain.user.dto.WithdrawalRequestDTO;
import com.ssafy.winedining.domain.user.service.UserService;
import com.ssafy.winedining.global.auth.dto.CustomOAuth2User;
import com.ssafy.winedining.global.common.ApiResponse;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.NoSuchElementException;

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

    /**
     * 사용자 닉네임 업데이트 API
     */
    @PatchMapping("/profile")
    public ResponseEntity<ApiResponse<UserResponseDTO>> updateProfile(
            @AuthenticationPrincipal CustomOAuth2User customOAuth2User,
            @RequestBody ProfileUpdateRequestDTO requestDTO) {

        Long userId = customOAuth2User.getUserId();
        UserResponseDTO responseDTO = userService.updateProfile(userId, requestDTO);

        ApiResponse<UserResponseDTO> response = ApiResponse.<UserResponseDTO>builder()
                .status(HttpStatus.OK.value())
                .success(true)
                .message("닉네임 변경 성공")
                .data(responseDTO)
                .build();

        return ResponseEntity.ok(response);
    }

    /**
     * 회원 탈퇴 API - 하이브리드 접근법
     *
     * @param customOAuth2User 현재 인증된 사용자
     * @param request 탈퇴 요청 정보
     * @param response HTTP 응답 객체 (쿠키 처리용)
     * @return 탈퇴 처리 결과
     */
    @PostMapping("/withdrawal")
    public ResponseEntity<ApiResponse<Void>> withdrawUser(
            @AuthenticationPrincipal CustomOAuth2User customOAuth2User,
            @RequestBody WithdrawalRequestDTO request,
            HttpServletResponse response) {

        try {
            Long userId = customOAuth2User.getUserId();
            userService.withdrawUser(userId, request, response);

            ApiResponse<Void> apiResponse = ApiResponse.<Void>builder()
                    .status(HttpStatus.OK.value())
                    .success(true)
                    .message("회원 탈퇴가 완료되었습니다.")
                    .build();

            return ResponseEntity.ok(apiResponse);
        } catch (NoSuchElementException e) {
            ApiResponse<Void> apiResponse = ApiResponse.<Void>builder()
                    .status(HttpStatus.NOT_FOUND.value())
                    .success(false)
                    .message(e.getMessage())
                    .build();

            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(apiResponse);
        } catch (Exception e) {
            ApiResponse<Void> apiResponse = ApiResponse.<Void>builder()
                    .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
                    .success(false)
                    .message("회원 탈퇴 중 오류가 발생했습니다: " + e.getMessage())
                    .build();

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(apiResponse);
        }
    }
}