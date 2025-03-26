package com.ssafy.winedining.domain.recommend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.winedining.domain.recommend.dto.RecommendByPreferenceDto;
import com.ssafy.winedining.domain.recommend.service.moduleService.RecommendDomainService;
import com.ssafy.winedining.domain.recommend.service.moduleService.RecommendFastApiService;
import com.ssafy.winedining.domain.wine.dto.WineResponseDTO;
import com.ssafy.winedining.domain.wine.service.WineService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RecommendService {

    private final RecommendDomainService recommendDomainService;
    private final RecommendFastApiService recommendFastApiService;
    private final WineService wineService;

    /**
     * 취향 테스트를 바탕으로 와인을 추천 받습니다.
     * FastAPI에 전달하여 처리 결과를 받아옵니다.
     *
     * @param userId 추천을 요청한 사용자 ID
     * @return FastAPI 서버로부터 받은 응답 (동기식 처리 예: .block() 사용)
     */
    public Mono<String> recommendByPreference(Long userId) {
        // 1. Repository에서 추천 데이터를 조회 (DTO 변환)
        RecommendByPreferenceDto data = recommendDomainService.recommendByPreferene(userId);
        // 2. WebClient를 이용해 FastAPI 서버에 DTO 데이터를 전달 (비동기 처리 후 동기적으로 응답 받음)
        // fastApiService.sendRecommendations()는 Mono<String>을 반환하는 것으로 가정합니다.
        return recommendFastApiService.sendData(data, "preference");
    }

    public Mono<List<WineResponseDTO>> getRecommendedWineDetails(Long userId) {
        return recommendByPreference(userId)
                .flatMap(resultString -> {
                    ObjectMapper mapper = new ObjectMapper();
                    try {
                        // 예시: {"recommended_wine_ids":[2,7,8,6,1]}
                        JsonNode root = mapper.readTree(resultString);
                        JsonNode idsNode = root.path("recommended_wine_ids");
                        List<Long> recommendedIds = new ArrayList<>();
                        if (idsNode.isArray()) {
                            for (JsonNode idNode : idsNode) {
                                recommendedIds.add(idNode.asLong());
                            }
                        }
                        // 각 추천 와인 ID마다 WineService의 getWineDetail() 호출
                        List<WineResponseDTO> wineDetails = new ArrayList<>();
                        for (Long wineId : recommendedIds) {
                            WineResponseDTO detail = wineService.getWineDetail(wineId);
                            wineDetails.add(detail);
                        }
                        return Mono.just(wineDetails);
                    } catch (Exception e) {
                        return Mono.error(e);
                    }
                });
    }

//    /**
//     * 페어링 음식을 바탕으로 와인을 추천 받습니다.
//     * FastAPI에 전달하여 처리 결과를 받아옵니다.
//     *
//     * @param userId 추천을 요청한 사용자 ID
//     * @return FastAPI 서버로부터 받은 응답 (동기식 처리 예: .block() 사용)
//     */
//    public String recommendByFood(Long userId) {
//        // 1. Repository에서 추천 데이터를 조회 (DTO 변환)
//        List<RecommendByFoodDto> recommendations = recommendDomainService.recommendByFood(userId);
//
//        // 2. WebClient를 이용해 FastAPI 서버에 DTO 데이터를 전달 (비동기 처리 후 동기적으로 응답 받음)
//        // fastApiService.sendRecommendations()는 Mono<String>을 반환하는 것으로 가정합니다.
//        String response = recommendFastApiService.sendRecommendations(recommendations).block();
//        return response;
//    }
//
//    /**
//     * 사용자 데이터를 이용해 와인을 추천 받습니다.
//     * FastAPI에 전달하여 처리 결과를 받아옵니다.
//     *
//     * @param userId 추천을 요청한 사용자 ID
//     * @return FastAPI 서버로부터 받은 응답 (동기식 처리 예: .block() 사용)
//     */
//    public String recommendByPerson(Long userId) {
//        // 1. Repository에서 추천 데이터를 조회 (DTO 변환)
//        List<RecommendByPersonDTO> recommendations = recommendDomainService.recommendByPerson(userId);
//
//        // 2. WebClient를 이용해 FastAPI 서버에 DTO 데이터를 전달 (비동기 처리 후 동기적으로 응답 받음)
//        // fastApiService.sendRecommendations()는 Mono<String>을 반환하는 것으로 가정합니다.
//        String response = recommendFastApiService.sendRecommendations(recommendations).block();
//        return response;
//    }
}
