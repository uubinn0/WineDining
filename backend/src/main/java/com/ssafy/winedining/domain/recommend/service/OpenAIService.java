package com.ssafy.winedining.domain.recommend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.ssafy.winedining.domain.wine.dto.WineResponseDTO;
import com.ssafy.winedining.global.cache.RedisCacheService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;

import java.time.Duration;
import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class OpenAIService {

    private final WebClient.Builder webClientBuilder;
    private final ObjectMapper objectMapper;
    private final RedisCacheService redisCacheService;

    // Redis 캐시 키 프리픽스
    private static final String WINE_DESCRIPTION_CACHE_PREFIX = "wine:description:";
    // 캐시 만료 시간 - 30일 (초 단위)
    private static final long CACHE_EXPIRATION_SECONDS = 30 * 24 * 60 * 60;

    @Value("${openai.api.key}")
    private String openaiApiKey;

    @Value("${openai.api.url:https://api.openai.com/v1/chat/completions}")
    private String openaiApiUrl;

    @Value("${openai.api.model:gpt-3.5-turbo}")
    private String openaiModel;

    /**
     * 와인 정보를 기반으로 OpenAI를 통해 맞춤형 설명을 생성
     * Redis 캐싱 적용 및 타입 안전 처리
     *
     * @param wine 와인 정보
     * @return 생성된 설명
     */
    public Mono<String> generateWineDescription(WineResponseDTO wine) {
        Instant start = Instant.now();
        Long wineId = wine.getWineId();
        String cacheKey = WINE_DESCRIPTION_CACHE_PREFIX + wineId;

        // 1. Redis 캐시에서 먼저 조회
        return Mono.fromCallable(() -> redisCacheService.get(cacheKey))
                .subscribeOn(Schedulers.boundedElastic())
                .flatMap(cachedDescription -> {
                    if (cachedDescription.isPresent()) {
                        // 캐시된 값을 문자열로 안전하게 변환
                        String description = cachedDescription.get().toString();
                        Instant end = Instant.now();
                        log.info("Redis 캐시에서 와인 ID {} 설명 조회됨: 소요 시간 {}ms",
                                wineId, Duration.between(start, end).toMillis());
                        return Mono.just(description);
                    }

                    // 2. 캐시에 없는 경우 OpenAI API 호출
                    log.info("와인 ID {} 설명 생성을 위해 OpenAI API 호출", wineId);
                    String prompt = createPromptForWine(wine);

                    try {
                        ObjectNode requestBody = objectMapper.createObjectNode();
                        requestBody.put("model", openaiModel);
                        requestBody.put("temperature", 0.7);

                        ObjectNode systemMessage = objectMapper.createObjectNode();
                        systemMessage.put("role", "system");
                        systemMessage.put("content", "당신은 와인 전문가입니다. 주어진 와인의 특성을 바탕으로 간결하고 매력적인 설명을 생성해주세요. 맛, 향, 어울리는 음식 등을 포함해 2-3문장으로 작성해주세요.");

                        ObjectNode userMessage = objectMapper.createObjectNode();
                        userMessage.put("role", "user");
                        userMessage.put("content", prompt);

                        requestBody.putArray("messages")
                                .add(systemMessage)
                                .add(userMessage);

                        return webClientBuilder.build()
                                .post()
                                .uri(openaiApiUrl)
                                .header(HttpHeaders.AUTHORIZATION, "Bearer " + openaiApiKey)
                                .contentType(MediaType.APPLICATION_JSON)
                                .body(BodyInserters.fromValue(requestBody.toString()))
                                .retrieve()
                                .bodyToMono(String.class)
                                .map(response -> {
                                    try {
                                        JsonNode jsonResponse = objectMapper.readTree(response);
                                        String generatedDescription = jsonResponse
                                                .path("choices")
                                                .path(0)
                                                .path("message")
                                                .path("content")
                                                .asText();

                                        // Redis 캐시에 문자열로 저장
                                        redisCacheService.set(cacheKey, generatedDescription, CACHE_EXPIRATION_SECONDS);

                                        Instant end = Instant.now();
                                        log.info("와인 ID {} 설명 생성 완료: 소요 시간 {}ms",
                                                wineId, Duration.between(start, end).toMillis());

                                        return generatedDescription;
                                    } catch (Exception e) {
                                        log.error("OpenAI 응답 파싱 중 오류: {}", e.getMessage());
                                        String fallbackDescription = createFallbackDescription(wine);
                                        return fallbackDescription;
                                    }
                                })
                                .onErrorResume(e -> {
                                    log.error("OpenAI API 호출 중 오류: {}", e.getMessage());
                                    String fallbackDescription = createFallbackDescription(wine);
                                    return Mono.just(fallbackDescription);
                                });
                    } catch (Exception e) {
                        log.error("OpenAI 요청 구성 중 오류: {}", e.getMessage());
                        String fallbackDescription = createFallbackDescription(wine);
                        return Mono.just(fallbackDescription);
                    }
                })
                .doOnError(e -> {
                    log.error("와인 설명 생성 과정에서 오류 발생: {}", e.getMessage(), e);
                    // 오류 시 기본 설명 반환
                    Mono.just(createFallbackDescription(wine));
                });
    }

    /**
     * 여러 와인에 대한 설명을 일괄 생성
     * @param wines 와인 목록
     * @return 설명이 추가된 와인 목록
     */
    public Mono<List<WineResponseDTO>> enrichWinesWithDescriptions(List<WineResponseDTO> wines) {
        Instant start = Instant.now();
        log.info("와인 설명 생성 시작: 와인 {}개", wines.size());

        List<Mono<WineResponseDTO>> enrichedWineMono = wines.stream()
                .map(wine -> generateWineDescription(wine)
                        .map(description -> {
                            wine.setDescription(description);
                            return wine;
                        }))
                .collect(Collectors.toList());

        return Mono.zip(enrichedWineMono, wineList -> {
            List<WineResponseDTO> result = new java.util.ArrayList<>(wineList.length);
            for (Object obj : wineList) {
                result.add((WineResponseDTO) obj);
            }

            Instant end = Instant.now();
            log.info("와인 설명 생성 완료: 총 소요 시간 {}ms", Duration.between(start, end).toMillis());

            return result;
        });
    }

    /**
     * 오류 발생 시 기본 설명 생성
     * @param wine 와인 정보
     * @return 기본 설명
     */
    private String createFallbackDescription(WineResponseDTO wine) {
        return String.format("이 와인은 %s 타입의 와인으로 %s에서 생산되었습니다. %s 포도로 만들어진 이 와인은 풍부한 맛을 선사합니다.",
                wine.getType(), wine.getCountry(), wine.getGrape() != null ? wine.getGrape() : "특별한");
    }

    /**
     * 와인 정보를 기반으로 프롬프트 생성
     */
    private String createPromptForWine(WineResponseDTO wine) {
        StringBuilder promptBuilder = new StringBuilder();
        promptBuilder.append("다음 와인에 대한 매력적인 설명을 2-3문장으로 작성해주세요.\n\n");
        promptBuilder.append("와인 이름: ").append(wine.getKrName()).append("\n");
        promptBuilder.append("와인 타입: ").append(wine.getType()).append("\n");
        promptBuilder.append("국가: ").append(wine.getCountry()).append("\n");
        promptBuilder.append("포도 품종: ").append(wine.getGrape()).append("\n");

        if (wine.getSweetness() != null) {
            promptBuilder.append("당도(0-5): ").append(wine.getSweetness()).append("\n");
        }
        if (wine.getAcidity() != null) {
            promptBuilder.append("산도(0-5): ").append(wine.getAcidity()).append("\n");
        }
        if (wine.getTannin() != null) {
            promptBuilder.append("탄닌(0-5): ").append(wine.getTannin()).append("\n");
        }
        if (wine.getBody() != null) {
            promptBuilder.append("바디감(0-5): ").append(wine.getBody()).append("\n");
        }
        if (wine.getAlcoholContent() != null) {
            promptBuilder.append("알코올 함량: ").append(wine.getAlcoholContent()).append("%\n");
        }

        if (wine.getPairing() != null && !wine.getPairing().isEmpty()) {
            promptBuilder.append("어울리는 음식: ").append(String.join(", ", wine.getPairing())).append("\n");
        }

        promptBuilder.append("\n어울리는 음식과 맛, 향 특징을 포함한 매력적인 설명을 작성해주세요. 설명의 시작을 (와인이름)은 ~ 으로 시작하지 말고 이 와인은 ~ 으로 시작하는 문장으로 작성해 주세요. 와인 초보자들이 이해하기 쉽게 70자 이내로 설명해주세요.");

        return promptBuilder.toString();
    }
}