package com.ssafy.winedining.domain.recommend.controller;

import com.ssafy.winedining.domain.recommend.service.RecommendService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api/v1/recommend")
@RequiredArgsConstructor
public class RecommendController {

    private final RecommendService recommendService;

    /**
     * @return
     */
    @GetMapping("")
    public ResponseEntity<String> getRecommendation() {

        System.out.println("recommendService = " + recommendService);

        // JWT를 이용해 현재 사용자로 추후 변경 예정
        Long userId = 1L;

        String result = recommendService.recommendByPreference(userId).block();
        return ResponseEntity.ok(result);

//        // RecommendService에서 Mono<String>을 받아 리턴
//        return recommendService.recommendByPreference(userId)
//                // 결과가 준비되면 HTTP 200 응답으로 감싸줍니다.
//                .map(ResponseEntity::ok)
//                // 결과가 없으면 404를 반환합니다.
//                .defaultIfEmpty(ResponseEntity.notFound().build());
    }









}
