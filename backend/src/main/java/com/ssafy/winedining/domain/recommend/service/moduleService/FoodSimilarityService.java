package com.ssafy.winedining.domain.recommend.service.moduleService;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.winedining.domain.food.entity.Food;
import com.ssafy.winedining.domain.food.repository.FoodRepository;
import com.ssafy.winedining.global.cache.RedisCacheService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;

import java.time.Duration;
import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class FoodSimilarityService {

    private final FoodRepository foodRepository;
    private final WebClient.Builder webClientBuilder;
    private final ObjectMapper objectMapper;
    private final RedisCacheService redisCacheService;

    // Redis 캐시 키 프리픽스
    private static final String FOOD_SIMILARITY_CACHE_PREFIX = "food:similarity:";
    // 캐시 만료 시간 - 7일 (초 단위)
    private static final long CACHE_EXPIRATION_SECONDS = 7 * 24 * 60 * 60;

    @Value("${openai.api.key}")
    private String openaiApiKey;

    @Value("${openai.api.url:https://api.openai.com/v1/chat/completions}")
    private String openaiApiUrl;

    @Value("${openai.api.model:gpt-3.5-turbo}")
    private String openaiModel;

    /**
     * 사용자가 입력한 음식과 가장 유사한 Food 항목의 ID를 찾아 반환 (동기 방식 - 이전 메서드)
     * 하위 호환성을 위해 유지
     *
     * @param userFoods 사용자가 입력한 음식 이름 목록
     * @return 유사한 음식 ID 목록
     */
    public List<Long> findSimilarFoods(List<String> userFoods) {
        log.info("동기 방식으로 유사 음식 찾기 시작: {}", userFoods);
        Instant start = Instant.now();

        // 비동기 메서드를 호출하고 결과를 동기적으로 기다림
        List<Long> result = findSimilarFoodsAsync(userFoods)
                .collectList()
                .block();

        Instant end = Instant.now();
        log.info("동기 방식 유사 음식 찾기 완료: 소요 시간 {}ms, 결과: {}",
                Duration.between(start, end).toMillis(), result);

        return result != null ? result : Collections.emptyList();
    }

    /**
     * 사용자가 입력한 음식과 가장 유사한 Food 항목의 ID를 비동기적으로 찾아 반환
     *
     * @param userFoods 사용자가 입력한 음식 이름 목록
     * @return 유사한 음식 ID를 포함한 Flux
     */
    public Flux<Long> findSimilarFoodsAsync(List<String> userFoods) {
        log.info("비동기 방식으로 유사 음식 찾기 시작: {}", userFoods);
        Instant startTotal = Instant.now();

        // 모든 음식 목록을 한 번만 가져오기
        return Mono.fromCallable(() -> foodRepository.findAll())
                .subscribeOn(Schedulers.boundedElastic())
                .flatMapMany(allFoods -> {
                    if (allFoods.isEmpty()) {
                        log.warn("음식 데이터가 없습니다.");
                        return Flux.empty();
                    }

                    // 각 입력 음식을 병렬로 처리
                    return Flux.fromIterable(userFoods)
                            .flatMap(userFood -> findSimilarFoodForSingleInput(userFood, allFoods))
                            .doOnComplete(() -> {
                                Instant endTotal = Instant.now();
                                log.info("모든 유사 음식 찾기 완료: 소요 시간 {}ms",
                                        Duration.between(startTotal, endTotal).toMillis());
                            });
                });
    }

    /**
     * 단일 음식 입력에 대해 유사한 음식 ID를 찾는 비동기 메서드
     * Redis 캐싱 기능 추가 및 타입 변환 오류 수정
     *
     * @param userFood 사용자가 입력한 음식 이름
     * @param allFoods 모든 음식 목록
     * @return 유사한 음식 ID를 포함한 Mono (유사한 음식이 없으면 empty)
     */
    private Mono<Long> findSimilarFoodForSingleInput(String userFood, List<Food> allFoods) {
        Instant start = Instant.now();
        log.debug("'{}' 음식의 유사 음식 찾기 시작", userFood);

        // 캐시 키 생성
        String cacheKey = FOOD_SIMILARITY_CACHE_PREFIX + userFood;

        // 1. Redis 캐시에서 먼저 조회
        return Mono.fromCallable(() -> redisCacheService.get(cacheKey))
                .subscribeOn(Schedulers.boundedElastic())
                .flatMap(cachedResult -> {
                    if (cachedResult.isPresent()) {
                        // 타입 변환 안전하게 처리
                        Object cachedValue = cachedResult.get();
                        Long foodId = null;

                        if (cachedValue instanceof Integer) {
                            // Integer를 Long으로 변환
                            foodId = ((Integer) cachedValue).longValue();
                            log.debug("Integer에서 Long으로 변환: {} -> {}", cachedValue, foodId);
                        } else if (cachedValue instanceof Long) {
                            foodId = (Long) cachedValue;
                        } else {
                            // 다른 타입인 경우 (예: String)
                            try {
                                foodId = Long.parseLong(cachedValue.toString());
                                log.debug("String에서 Long으로 변환: {} -> {}", cachedValue, foodId);
                            } catch (NumberFormatException e) {
                                log.error("캐시 값을 Long으로 변환할 수 없음: {}", cachedValue);
                                return Mono.empty();
                            }
                        }

                        Instant end = Instant.now();
                        log.info("Redis 캐시에서 '{}' 음식의 유사 음식 ID {} 조회됨: 소요 시간 {}ms",
                                userFood, foodId, Duration.between(start, end).toMillis());
                        return Mono.just(foodId);
                    }

                    // 2. 정확히 일치하는 음식 찾기 (대소문자 무시, 부분 일치)
                    return Mono.fromCallable(() -> foodRepository.findByFoodNameContaining(userFood))
                            .subscribeOn(Schedulers.boundedElastic())
                            .flatMap(exactMatchOpt -> {
                                if (exactMatchOpt.isPresent()) {
                                    Food exactMatch = exactMatchOpt.get();
                                    Long foodId = exactMatch.getId();

                                    // 캐시에 저장 - String으로 저장하여 타입 변환 문제 방지
                                    redisCacheService.set(cacheKey, String.valueOf(foodId), CACHE_EXPIRATION_SECONDS);

                                    Instant end = Instant.now();
                                    log.debug("'{}' 음식에 대해 정확히 일치하는 음식 '{}' 찾음 (ID: {}): 소요 시간 {}ms",
                                            userFood, exactMatch.getFoodName(), foodId,
                                            Duration.between(start, end).toMillis());
                                    return Mono.just(foodId);
                                }

                                // 3. 정확히 일치하는 음식이 없으면 OpenAI로 유사도 계산
                                return findMostSimilarFoodUsingOpenAIAsync(userFood, allFoods)
                                        .flatMap(mostSimilarFood -> {
                                            if (mostSimilarFood == null || "no_similar_food".equals(mostSimilarFood)) {
                                                log.debug("'{}' 음식에 대해 유사한 음식을 찾지 못함", userFood);
                                                return Mono.empty();
                                            }

                                            return Mono.fromCallable(() -> foodRepository.findByFoodName(mostSimilarFood))
                                                    .subscribeOn(Schedulers.boundedElastic())
                                                    .flatMap(similarFoodOpt -> {
                                                        if (similarFoodOpt.isPresent()) {
                                                            Long foodId = similarFoodOpt.get().getId();

                                                            // 캐시에 저장 - String으로 저장하여 타입 변환 문제 방지
                                                            redisCacheService.set(cacheKey, String.valueOf(foodId), CACHE_EXPIRATION_SECONDS);

                                                            Instant end = Instant.now();
                                                            log.debug("'{}' 음식에 대해 유사한 음식 '{}' 찾음 (ID: {}): 소요 시간 {}ms",
                                                                    userFood, similarFoodOpt.get().getFoodName(), foodId,
                                                                    Duration.between(start, end).toMillis());
                                                            return Mono.just(foodId);
                                                        }
                                                        return Mono.empty();
                                                    });
                                        });
                            });
                })
                .doOnError(e -> log.error("'{}' 음식의 유사 음식 찾기 중 오류 발생: {}", userFood, e.getMessage(), e));
    }

    /**
     * OpenAI API를 사용하여 사용자 입력과 가장 유사한 음식 비동기적으로 찾기
     *
     * @param userFood 사용자가 입력한 음식 이름
     * @param allFoods 모든 음식 목록
     * @return 가장 유사한 음식 이름을 포함한 Mono, 유사도가 낮으면 "no_similar_food"
     */
    private Mono<String> findMostSimilarFoodUsingOpenAIAsync(String userFood, List<Food> allFoods) {
        Instant start = Instant.now();
        log.debug("OpenAI API를 사용하여 '{}' 음식의 유사 음식 찾기 시작", userFood);

        // 음식 이름 목록
        List<String> foodNames = allFoods.stream()
                .map(Food::getFoodName)
                .collect(Collectors.toList());

        try {
            // OpenAI API 요청 구성
            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("model", openaiModel);
            requestBody.put("temperature", 0);
            requestBody.put("max_tokens", 50);

            List<Map<String, String>> messages = new ArrayList<>();

            // 시스템 메시지
            Map<String, String> systemMessage = new HashMap<>();
            systemMessage.put("role", "system");
            systemMessage.put("content", "당신은 음식 유사도를 판단하는 전문가입니다. 입력된 음식과 가장 유사한 음식을 찾아주세요.");
            messages.add(systemMessage);

            // 사용자 메시지
            Map<String, String> userMessage = new HashMap<>();
            userMessage.put("role", "user");
            userMessage.put("content", buildPrompt(userFood, foodNames));
            messages.add(userMessage);

            requestBody.put("messages", messages);

            // 비동기 API 호출
            return webClientBuilder.build()
                    .post()
                    .uri(openaiApiUrl)
                    .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                    .header(HttpHeaders.AUTHORIZATION, "Bearer " + openaiApiKey)
                    .body(BodyInserters.fromValue(requestBody))
                    .retrieve()
                    .bodyToMono(String.class)
                    .map(responseString -> {
                        try {
                            // 응답 파싱
                            JsonNode responseJson = objectMapper.readTree(responseString);
                            String content = responseJson.path("choices").path(0).path("message").path("content").asText();
                            log.info("OpenAI 응답: {}", content);

                            // 결과에서 음식 이름 추출
                            for (String foodName : foodNames) {
                                if (content.contains(foodName)) {
                                    Instant end = Instant.now();
                                    log.debug("OpenAI API를 사용하여 '{}' 음식의 유사 음식 '{}' 찾음: 소요 시간 {}ms",
                                            userFood, foodName, Duration.between(start, end).toMillis());
                                    return foodName;
                                }
                            }

                            // "유사한 음식 없음"이라는 응답이 있으면 특별한 값 반환
                            if (content.contains("유사한 음식 없음") || content.contains("없습니다")) {
                                return "no_similar_food";
                            }

                            return null;
                        } catch (Exception e) {
                            log.error("OpenAI 응답 파싱 중 오류: {}", e.getMessage());
                            return null;
                        }
                    })
                    .doOnError(e -> log.error("OpenAI API 호출 중 오류: {}", e.getMessage()))
                    .onErrorResume(e -> Mono.just("no_similar_food"));  // 오류 발생 시 기본값 반환
        } catch (Exception e) {
            log.error("OpenAI 요청 구성 중 오류: {}", e.getMessage());
            return Mono.just("no_similar_food");
        }
    }

    /**
     * OpenAI API 요청을 위한 프롬프트 생성
     *
     * @param userFood 사용자가 입력한 음식 이름
     * @param foodNames 모든 음식 이름 목록
     * @return 프롬프트 문자열
     */
    private String buildPrompt(String userFood, List<String> foodNames) {
        StringBuilder prompt = new StringBuilder();
        prompt.append("입력된 음식: \"").append(userFood).append("\"\n\n");
        prompt.append("다음 목록에서 입력된 음식과 가장 유사한 음식을 찾아주세요:\n");

        for (String foodName : foodNames) {
            prompt.append("- ").append(foodName).append("\n");
        }

        prompt.append("\n만약 유사도가 30% 미만이라면 \"유사한 음식 없음\"이라고 답변해주세요. ");
        prompt.append("유사한 음식이 있다면 \"가장 유사한 음식은 [음식 이름]입니다\"라고만 답변해주세요.");

        return prompt.toString();
    }
}