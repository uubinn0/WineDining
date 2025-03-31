package com.ssafy.winedining.domain.recommend.controller;

import com.ssafy.winedining.domain.recommend.service.RecommendService;
import com.ssafy.winedining.domain.wine.dto.WineResponseDTO;
import com.ssafy.winedining.global.auth.dto.CustomOAuth2User;
import com.ssafy.winedining.global.common.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.util.List;

@RestController
@RequestMapping("/api/v1/recommend")
@RequiredArgsConstructor
public class RecommendController {

    private final RecommendService recommendService;

    /**
     * @return
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<WineResponseDTO>>> getRecommendation(
            @AuthenticationPrincipal CustomOAuth2User customOAuth2User
    ) {
        Long userId = customOAuth2User.getUserId();
        List<WineResponseDTO> recommendedWines = recommendService.getRecommendedWineDetails(userId).block();

        ApiResponse<List<WineResponseDTO>> response = ApiResponse.<List<WineResponseDTO>>builder()
                .status(HttpStatus.OK.value())
                .success(true)
                .message("추천 와인 상세 정보 조회 성공")
                .data(recommendedWines)
                .build();

        return ResponseEntity.ok(response);

    }
}
