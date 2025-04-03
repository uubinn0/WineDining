package com.ssafy.winedining.domain.recommend.controller;

import com.ssafy.winedining.domain.recommend.dto.RecommendByFoodDto;
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
    @PostMapping
    public ResponseEntity<ApiResponse<List<WineResponseDTO>>> getRecommendation(
            @AuthenticationPrincipal CustomOAuth2User customOAuth2User,
            @RequestBody RecommendByFoodDto recommendByFoodDto
    ) {
        Long userId = customOAuth2User.getUserId();
        String paring = recommendByFoodDto.getPairing();
        List<WineResponseDTO> recommendedWines = recommendService.getRecommendedWineDetails(userId, paring).block();

        ApiResponse<List<WineResponseDTO>> response = ApiResponse.<List<WineResponseDTO>>builder()
                .status(HttpStatus.OK.value())
                .success(true)
                .message("추천 와인 상세 정보 조회 성공")
                .data(recommendedWines)
                .build();

        return ResponseEntity.ok(response);

    }

    /**
     * @return
     */
    @GetMapping("/master/week")
    public ResponseEntity<ApiResponse<List<WineResponseDTO>>> getWeeklyRecommendations() {
        // 비동기 호출 결과를 동기적으로 변환
        List<WineResponseDTO> response = recommendService.getWeeklyRecommendations().block();

        ApiResponse<List<WineResponseDTO>> apiResponse = ApiResponse.<List<WineResponseDTO>>builder()
                .status(HttpStatus.OK.value())
                .success(true)
                .message("마스터의 이 주의 와인 추천 조회 성공")
                .data(response)
                .build();

        return ResponseEntity.ok(apiResponse);
    }

}
