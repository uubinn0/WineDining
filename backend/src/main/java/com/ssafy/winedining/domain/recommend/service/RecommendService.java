package com.ssafy.winedining.domain.recommend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.winedining.domain.info.entity.Info;
import com.ssafy.winedining.domain.info.entity.InfoDetail;
import com.ssafy.winedining.domain.info.repository.InfoRepository;
import com.ssafy.winedining.domain.recommend.dto.RecommendByPreferenceDto;
import com.ssafy.winedining.domain.recommend.service.moduleService.FoodSimilarityService;
import com.ssafy.winedining.domain.recommend.service.moduleService.RecommendDomainService;
import com.ssafy.winedining.domain.recommend.service.moduleService.RecommendFastApiService;
import com.ssafy.winedining.domain.wine.dto.WineResponseDTO;
import com.ssafy.winedining.domain.wine.entity.Wine;
import com.ssafy.winedining.domain.wine.service.WineService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;

import java.time.LocalDate;
import java.time.temporal.WeekFields;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RecommendService {

    private final RecommendDomainService recommendDomainService;
    private final RecommendFastApiService recommendFastApiService;
    private final WineService wineService;
    private final FoodSimilarityService foodSimilarityService;
    private final OpenAIService openAIService; // OpenAI 서비스 추가
    private final InfoRepository infoRepository;

    /**
     * 취향 테스트를 바탕으로 와인을 추천 받습니다.
     * FastAPI에 전달하여 처리 결과를 받아옵니다.
     *
     * @param userId 추천을 요청한 사용자 ID
     * @return FastAPI 서버로부터 받은 응답 (동기식 처리 예: .block() 사용)
     */
    public Mono<String> recommendByPreference(Long userId, List<Long> similarFoodIds) {
        // 1. Repository에서 추천 데이터를 조회 (DTO 변환)
        RecommendByPreferenceDto preferenceData = recommendDomainService.recommendByPreferene(userId);

        // 2. DTO에 음식 ID 목록 설정
        preferenceData.setFoodIds(similarFoodIds);
        System.out.println(preferenceData);
        // 3. FastAPI에 DTO 전송
        return recommendFastApiService.sendData(preferenceData, "preference");
    }

    public Mono<List<WineResponseDTO>> getRecommendedWineDetails(Long userId, String paring) {
        // 음식 ID 목록 초기화
        List<Long> similarFoodIds = new ArrayList<>();

        // 음식 페어링 정보가 제공된 경우, 유사한 음식 ID 목록 찾기
        if (paring != null && !paring.trim().isEmpty()) {
            List<String> foodNames = Arrays.stream(paring.split(","))
                    .map(String::trim)
                    .filter(food -> !food.isEmpty())
                    .collect(Collectors.toList());

            similarFoodIds = foodSimilarityService.findSimilarFoods(foodNames);
            System.out.println("similarFoodIds: " + similarFoodIds);
        }

        return recommendByPreference(userId, similarFoodIds)
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

                        // OpenAI 서비스를 이용해 설명 생성 및 와인 정보에 추가
                        return openAIService.enrichWinesWithDescriptions(wineDetails);
                    } catch (Exception e) {
                        return Mono.error(e);
                    }
                });
    }

    /**
     * 마스터의 주간 와인 추천 목록을 가져옵니다.
     * @return 추천 와인 정보가 담긴 리스트
     */
    public Mono<List<WineResponseDTO>> getWeeklyRecommendations() {
        // 현재 주차 계산
        LocalDate today = LocalDate.now();
        int weekNumber = today.get(WeekFields.of(Locale.getDefault()).weekOfYear());
        System.out.println("weekNumber: " + weekNumber);

        // "weekly_recommend" + 주차로 저장된 Info 찾기
        Pageable pageable = PageRequest.of(0, 1); // 첫 번째 결과만 가져옴
        Page<Info> infoPage = infoRepository.findByTypeStartingWith("weekly_recommend" + weekNumber, pageable);

        List<WineResponseDTO> weeklyRecommendations = new ArrayList<>();

        if (infoPage.isEmpty()) {
            // 저장된 주간 추천이 없는 경우, 기본 추천 목록 반환
            weeklyRecommendations = getDefaultRecommendations();
        } else {
            Info weeklyInfo = infoPage.getContent().get(0);

            try {
                // title 필드에서 와인 ID 배열 파싱 (예: [1, 2, 3])
                ObjectMapper mapper = new ObjectMapper();
                JsonNode wineIdsNode = mapper.readTree(weeklyInfo.getTitle());

                if (wineIdsNode.isArray()) {
                    for (JsonNode idNode : wineIdsNode) {
                        Long wineId = idNode.asLong();
                        try {
                            WineResponseDTO wineDetail = wineService.getWineDetail(wineId);
                            weeklyRecommendations.add(wineDetail);
                        } catch (NoSuchElementException e) {
                            // 와인이 존재하지 않는 경우 로깅 처리
                            System.err.println("추천된 와인 ID가 존재하지 않습니다: " + wineId);
                        }
                    }
                }

                // 추천 와인이 3개 미만인 경우, 기본 추천으로 보충
                if (weeklyRecommendations.size() < 3) {
                    List<WineResponseDTO> defaultRecommendations = getDefaultRecommendations();
                    int remainingCount = 3 - weeklyRecommendations.size();

                    for (int i = 0; i < Math.min(remainingCount, defaultRecommendations.size()); i++) {
                        weeklyRecommendations.add(defaultRecommendations.get(i));
                    }
                }
            } catch (Exception e) {
                // JSON 파싱 오류 등 예외 발생 시 기본 추천 목록 반환
                System.err.println("주간 추천 와인 정보 파싱 중 오류: " + e.getMessage());
                weeklyRecommendations = getDefaultRecommendations();
            }
        }

        // OpenAI 서비스를 이용해 설명 생성 및 와인 정보에 추가
        return openAIService.enrichWinesWithDescriptions(weeklyRecommendations);
    }

    private List<WineResponseDTO> getDefaultRecommendations() {
        // 기본적으로 추천할 와인 ID 목록 (인기 있거나 대표적인 와인 ID를 선택)
        List<Long> defaultWineIds = Arrays.asList(140166L, 137354L, 139119L);

        List<WineResponseDTO> defaultRecommendations = new ArrayList<>();
        for (Long wineId : defaultWineIds) {
            try {
                WineResponseDTO wineDetail = wineService.getWineDetail(wineId);
                defaultRecommendations.add(wineDetail);
            } catch (NoSuchElementException e) {
                // 와인이 존재하지 않는 경우 로깅 처리
                System.err.println("기본 추천 와인 ID가 존재하지 않습니다: " + wineId);
            }
        }

        return defaultRecommendations;
    }

//    /**
//     * 페어링 음식을 바탕으로 와인을 추천 받습니다.x
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
