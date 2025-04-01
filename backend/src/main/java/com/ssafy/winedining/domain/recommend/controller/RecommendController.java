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
    @GetMapping
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

//        // RecommendService에서 Mono<String>을 받아 리턴
//        return recommendService.recommendByPreference(userId)
//                // 결과가 준비되면 HTTP 200 응답으로 감싸줍니다.
//                .map(ResponseEntity::ok)
//                // 결과가 없으면 404를 반환합니다.
//                .defaultIfEmpty(ResponseEntity.notFound().build());
    }









}
