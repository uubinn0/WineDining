package com.ssafy.winedining.domain.preference.service;

import com.ssafy.winedining.domain.preference.entity.Preference;
import com.ssafy.winedining.domain.preference.repository.PreferenceRepository;
import com.ssafy.winedining.domain.preference.dto.request.PreferenceTestRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;

@Service
@RequiredArgsConstructor
public class PreferenceService {

    private final PreferenceRepository preferenceRepository;

    /**
     * 사용자에게 입력받은 테스트 결과를 entity로 저장합니다.
     *
     * @param userId
     * @param preferenceTest
     */
    public void saveUserPreferenceTest(Long userId, PreferenceTestRequest preferenceTest){

        Preference userPreference = Preference.builder()
                .userId(userId)
                .alcoholContent(preferenceTest.getAlcoholContent())
                .sweetness(preferenceTest.getSweetness())
                .acidity(preferenceTest.getAcidity())
                .tannin(preferenceTest.getTannin())
                .body(preferenceTest.getBody())
                .red(preferenceTest.getPreferredTypes().equals("red"))
                .white(preferenceTest.getPreferredTypes().equals("white"))
                .sparkling(preferenceTest.getPreferredTypes().equals("sparkling"))
                .rose(preferenceTest.getPreferredTypes().equals("rose"))
                .createdAt(new Timestamp(System.currentTimeMillis()))
                .updatedAt(null)
                .build();

        preferenceRepository.save(userPreference);
    }

    /**
     * UserId로 추천 테이블 조회(RecommendDomainService 에서 사용)
     *
     * @param userId
     * @return
     */
    public Preference getPreferenceByUserId(Long userId) {
        return preferenceRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("Preference not found for user: " + userId));
    }




}
