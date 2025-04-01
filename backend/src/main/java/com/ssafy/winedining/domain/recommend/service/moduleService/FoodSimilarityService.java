package com.ssafy.winedining.domain.recommend.service.moduleService;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.winedining.domain.food.entity.Food;
import com.ssafy.winedining.domain.food.repository.FoodRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FoodSimilarityService {

    private final FoodRepository foodRepository;
    private final WebClient.Builder webClientBuilder;

    @Value("${openai.api.key}")
    private String openaiApiKey;

    @Value("${openai.api.url:https://api.openai.com/v1/chat/completions}")
    private String openaiApiUrl;

    @Value("${openai.api.model:gpt-3.5-turbo}")
    private String openaiModel;

    /**
     * 사용자가 입력한 음식과 가장 유사한 Food 항목의 ID를 찾아 반환
     *
     * @param userFoods 사용자가 입력한 음식 이름 목록
     * @return 유사한 음식 ID 목록 (유사한 음식이 없으면 빈 목록 반환)
     */
    public List<Long> findSimilarFoods(List<String> userFoods) {
        List<Long> similarFoodIds = new ArrayList<>();

        // 모든 음식 목록 가져오기
        List<Food> allFoods = foodRepository.findAll();
        if (allFoods.isEmpty()) {
            return Collections.emptyList(); // 음식 데이터가 없으면 빈 목록 반환
        }

        // 각 입력 음식에 대해 유사한 음식 찾기
        for (String userFood : userFoods) {
            // 1. 먼저 정확히 일치하는 음식이 있는지 확인
            Optional<Food> exactMatchOpt = foodRepository.findByFoodNameContaining(userFood);

            if (exactMatchOpt.isPresent()) {
                // 정확히 일치하는 음식이 있으면 해당 음식 ID 추가
                similarFoodIds.add(exactMatchOpt.get().getId());
                continue;
            }

            // 2. 정확히 일치하는 음식이 없으면 OpenAI API로 유사도 계산
            String mostSimilarFood = findMostSimilarFoodUsingOpenAI(userFood, allFoods);
            if (mostSimilarFood != null && !mostSimilarFood.equals("no_similar_food")) {
                Optional<Food> similarFoodOpt = foodRepository.findByFoodName(mostSimilarFood);
                similarFoodOpt.ifPresent(food -> similarFoodIds.add(food.getId()));
            }
        }

        return similarFoodIds;
    }

    /**
     * OpenAI API를 사용하여 사용자 입력과 가장 유사한 음식 찾기
     *
     * @param userFood 사용자가 입력한 음식 이름
     * @param allFoods 모든 음식 목록
     * @return 가장 유사한 음식 이름, 유사도가 낮으면 "no_similar_food"
     */
    private String findMostSimilarFoodUsingOpenAI(String userFood, List<Food> allFoods) {
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

            List<Map<String, Object>> messages = new ArrayList<>();

            // 시스템 메시지
            Map<String, Object> systemMessage = new HashMap<>();
            systemMessage.put("role", "system");
            systemMessage.put("content", "당신은 음식 유사도를 판단하는 전문가입니다. 입력된 음식과 가장 유사한 음식을 찾아주세요.");
            messages.add(systemMessage);

            // 사용자 메시지
            Map<String, Object> userMessage = new HashMap<>();
            userMessage.put("role", "user");
            userMessage.put("content", buildPrompt(userFood, foodNames));
            messages.add(userMessage);

            requestBody.put("messages", messages);

            // API 호출
            String responseString = webClientBuilder.build()
                    .post()
                    .uri(openaiApiUrl)
                    .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                    .header(HttpHeaders.AUTHORIZATION, "Bearer " + openaiApiKey)
                    .body(BodyInserters.fromValue(requestBody))
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();

            // 응답 파싱
            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode responseJson = objectMapper.readTree(responseString);
            String content = responseJson.path("choices").path(0).path("message").path("content").asText();
            System.out.println(content);
            // 결과에서 음식 이름 추출
            for (String foodName : foodNames) {
                if (content.contains(foodName)) {
                    return foodName;
                }
            }

            // "유사한 음식 없음"이라는 응답이 있으면 특별한 값 반환
            if (content.contains("유사한 음식 없음") || content.contains("없습니다")) {
                return "no_similar_food";
            }

            return null;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
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