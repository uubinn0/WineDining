package com.ssafy.winedining.domain.preference.controller;

import com.ssafy.winedining.domain.preference.service.PreferenceService;
import com.ssafy.winedining.domain.preference.dto.request.PreferenceTestRequest;
import com.ssafy.winedining.global.auth.dto.CustomOAuth2User;
import com.ssafy.winedining.global.common.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/preference")
public class PreferenceController {

    private final PreferenceService preferenceService;

    /**
     * 사용자에게 취향 추천 테스트를 입력 받아 저장합니다.
     *
     * @param request
     * @return
     */
    @PostMapping("/test")
    public ResponseEntity<ApiResponse<Void>> getPreferenceTest(
            @AuthenticationPrincipal CustomOAuth2User customOAuth2User,
            @RequestBody PreferenceTestRequest request){
        // 유저 컨텍스트에서 유저ID 받기
        Long userId = customOAuth2User.getUserId();customOAuth2User.getUserId();
        preferenceService.saveUserPreferenceTest(userId, request);

        ApiResponse<Void> response = ApiResponse.<Void>builder()
                .status(HttpStatus.OK.value())
                .success(true)
                .message("취향 추천 검사 결과 저장 성공")
                .data(null)
                .build();

        return ResponseEntity.ok(response);
    }
}
