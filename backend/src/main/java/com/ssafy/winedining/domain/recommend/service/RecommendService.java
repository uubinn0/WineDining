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
import com.ssafy.winedining.global.exception.CustomException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;

import java.time.Duration;
import java.time.Instant;
import java.time.LocalDate;
import java.time.temporal.WeekFields;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class RecommendService {

    private final RecommendDomainService recommendDomainService;
    private final RecommendFastApiService recommendFastApiService;
    private final WineService wineService;
    private final FoodSimilarityService foodSimilarityService;
    private final OpenAIService openAIService; // OpenAI 서비스 추가
    private final InfoRepository infoRepository;
    private final ObjectMapper objectMapper;

    /**
     * 취향 테스트와 음식 페어링을 바탕으로 와인을 추천 받고 상세 정보를 가져옵니다.
     * 모든 단계를 비동기적으로 처리합니다.
     *
     * @param userId 추천을 요청한 사용자 ID
     * @param paring 사용자가 입력한 음식 이름 (쉼표로 구분)
     * @return 추천된 와인 정보 목록을 담은 Mono
     */
    public Mono<List<WineResponseDTO>> getRecommendedWineDetails(Long userId, String paring) {
        log.info("시작: getRecommendedWineDetails - userId: {}, paring: {}", userId, paring);
        Instant startTotal = Instant.now();

        // 1단계: 음식 유사성 찾기 (비동기)
        Mono<List<Long>> similarFoodIdsMono;

        if (paring != null && !paring.trim().isEmpty()) {
            Instant startFoodSimilarity = Instant.now();
            List<String> foodNames = Arrays.stream(paring.split(","))
                    .map(String::trim)
                    .filter(food -> !food.isEmpty())
                    .collect(Collectors.toList());

            // 비동기 음식 유사성 서비스 호출
            similarFoodIdsMono = foodSimilarityService.findSimilarFoodsAsync(foodNames)
                    .collectList()
                    .doOnSuccess(ids -> {
                        Instant endFoodSimilarity = Instant.now();
                        log.info("음식 유사성 찾기 소요 시간: {} ms, 결과: {}",
                                Duration.between(startFoodSimilarity, endFoodSimilarity).toMillis(), ids);
                    });
        } else {
            // 음식 페어링 정보가 없는 경우 빈 리스트 반환
            similarFoodIdsMono = Mono.just(new ArrayList<>());
        }

        // 2단계: 사용자 취향 정보 가져오기 + 추천 API 호출 (비동기)
        return similarFoodIdsMono.flatMap(similarFoodIds -> {
            Instant startRecommend = Instant.now();

            // 추천 API 호출
            return recommendByPreference(userId, similarFoodIds)
                    .doOnSuccess(result -> {
                        Instant endRecommend = Instant.now();
                        log.info("추천 API 호출 소요 시간: {} ms",
                                Duration.between(startRecommend, endRecommend).toMillis());
                    })
                    // 3단계: 추천 결과 파싱 및 와인 상세 정보 가져오기 (비동기)
                    .flatMap(resultString -> {
                        Instant startParsing = Instant.now();
                        List<Long> recommendedIds = new ArrayList<>();
                        try {
                            JsonNode root = objectMapper.readTree(resultString);
                            JsonNode idsNode = root.path("recommended_wine_ids");

                            if (idsNode.isArray()) {
                                for (JsonNode idNode : idsNode) {
                                    recommendedIds.add(idNode.asLong());
                                }
                            }
                            log.info("추천된 와인 ID 목록: {}", recommendedIds);
                        } catch (Exception e) {
                            log.error("추천 결과 파싱 중 오류: {}", e.getMessage());
                            return Mono.error(e);
                        }
                        Instant endParsing = Instant.now();
                        log.info("추천 결과 파싱 소요 시간: {} ms",
                                Duration.between(startParsing, endParsing).toMillis());

                        if (recommendedIds.isEmpty()) {
                            return Mono.just(Collections.<WineResponseDTO>emptyList());
                        }

                        // 4단계: 와인 상세 정보 병렬 조회
                        Instant startWineDetails = Instant.now();
                        return Flux.fromIterable(recommendedIds)
                                .parallel()
                                .runOn(Schedulers.boundedElastic())
                                .flatMap(wineId -> {
                                    try {
                                        WineResponseDTO detail = wineService.getWineDetail(wineId);
                                        return Mono.just(detail);
                                    } catch (Exception e) {
                                        log.error("와인 ID: {} 상세 정보 조회 중 오류: {}", wineId, e.getMessage());
                                        return Mono.empty();
                                    }
                                })
                                .sequential()
                                .collectList()
                                .doOnSuccess(wines -> {
                                    Instant endWineDetails = Instant.now();
                                    log.info("와인 상세 정보 조회 소요 시간: {} ms, 결과 개수: {}",
                                            Duration.between(startWineDetails, endWineDetails).toMillis(), wines.size());
                                })
                                // 5단계: OpenAI 설명 생성 및 와인 정보 보강
                                .flatMap(wineDetails -> {
                                    if (wineDetails.isEmpty()) {
                                        return Mono.just(Collections.<WineResponseDTO>emptyList());
                                    }

                                    Instant startOpenAI = Instant.now();
                                    return openAIService.enrichWinesWithDescriptions(wineDetails)
                                            .doOnSuccess(enrichedWines -> {
                                                Instant endOpenAI = Instant.now();
                                                log.info("OpenAI 설명 생성 소요 시간: {} ms",
                                                        Duration.between(startOpenAI, endOpenAI).toMillis());

                                                Instant endTotal = Instant.now();
                                                log.info("전체 getRecommendedWineDetails 소요 시간: {} ms",
                                                        Duration.between(startTotal, endTotal).toMillis());
                                            });
                                });
                    });
        });
    }

    /**
     * 취향 테스트를 바탕으로 와인을 추천 받습니다.
     * FastAPI에 전달하여 처리 결과를 받아옵니다.
     *
     * @param userId 추천을 요청한 사용자 ID
     * @param similarFoodIds 유사한 음식 ID 목록
     * @return FastAPI 서버로부터 받은 응답 (Mono<String>)
     */
    public Mono<String> recommendByPreference(Long userId, List<Long> similarFoodIds) {
        Instant start = Instant.now();

        // 사용자 취향 데이터 조회 (동기 작업)
        return Mono.fromCallable(() -> {
                    RecommendByPreferenceDto preferenceData = recommendDomainService.recommendByPreferene(userId);
                    preferenceData.setFoodIds(similarFoodIds);
                    log.info("취향 데이터: {}", preferenceData);
                    return preferenceData;
                })
                .subscribeOn(Schedulers.boundedElastic())
                .doOnSuccess(data -> {
                    Instant afterPreferenceData = Instant.now();
                    log.info("취향 데이터 조회 소요 시간: {} ms",
                            Duration.between(start, afterPreferenceData).toMillis());
                })
                // FastAPI에 데이터 전송 (비동기)
                .flatMap(preferenceData ->
                        recommendFastApiService.sendData(preferenceData, "preference")
                                .doOnSuccess(result -> {
                                    Instant end = Instant.now();
                                    log.info("FastAPI 통신 소요 시간: {} ms",
                                            Duration.between(start, end).toMillis());
                                })
                );
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
