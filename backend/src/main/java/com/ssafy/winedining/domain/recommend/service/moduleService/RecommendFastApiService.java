package com.ssafy.winedining.domain.recommend.service.moduleService;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@Service
@RequiredArgsConstructor
public class RecommendFastApiService {

    private final WebClient.Builder webClientBuilder;

    @Value("${recommendation.api.url}")
    private String recommendationApiUrl;

    /**
     * 추천 DTO 리스트를 FastAPI 서버로 전송하고, 응답 결과를 Mono<String> 형태로 반환합니다.
     *
     * @param data 추천 DTO 리스트 (추천 방식에 따라 RecommendByPreferenceDto, RecommendByFoodDto, RecommendByPersonDTO 등이 올 수 있음)
     * @return FastAPI 서버 응답을 감싼 Mono<String>
     */
    public <T> Mono<String> sendData(T data, String endpoint) {
        String targetUrl = recommendationApiUrl + endpoint;
        
        return webClientBuilder.build()
                .post()
                .uri(targetUrl) // FastAPI 서버의 URL로 변경
                .bodyValue(data)
                .retrieve()
                .bodyToMono(String.class);
    }
}
