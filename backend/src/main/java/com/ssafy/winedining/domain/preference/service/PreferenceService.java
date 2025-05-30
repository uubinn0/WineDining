package com.ssafy.winedining.domain.preference.service;

import com.ssafy.winedining.domain.preference.entity.Preference;
import com.ssafy.winedining.domain.preference.repository.PreferenceRepository;
import com.ssafy.winedining.domain.preference.dto.request.PreferenceTestRequest;
import com.ssafy.winedining.global.exception.CustomException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.util.List;

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
                .red(preferenceTest.getPreferredTypes().equals("레드"))
                .white(preferenceTest.getPreferredTypes().equals("화이트"))
                .sparkling(preferenceTest.getPreferredTypes().equals("스파클링"))
                .rose(preferenceTest.getPreferredTypes().equals("로제"))
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
        List<Preference> preferences = preferenceRepository.findByUserIdOrderByCreatedAtDesc(userId);

        if (preferences.isEmpty()) {
            throw new CustomException(HttpStatus.BAD_REQUEST, "사용자 취향 정보가 없습니다. 취향 테스트를 먼저 진행해주세요.");
        }

        // 리스트의 첫 번째 요소(가장 최근에 생성된 취향)를 반환
        return preferences.get(0);
    }
}
