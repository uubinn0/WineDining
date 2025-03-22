package com.ssafy.winedining.domain.preference.service;

import com.ssafy.winedining.domain.preference.entity.Preference;
import com.ssafy.winedining.domain.preference.repository.PreferenceRepository;
import com.ssafy.winedining.domain.recommend.dto.request.PreferenceTestRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;

import java.util.Arrays;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

class PreferenceServiceTest {

    private PreferenceService preferenceService;
    private PreferenceRepository preferenceRepository;

    @BeforeEach
    void setUp() {
        // Mock 객체 생성
        preferenceRepository = mock(PreferenceRepository.class);
        // 테스트 대상 Service 에 Mock Repository 주입
        preferenceService = new PreferenceService(preferenceRepository);
    }

    @Test
    void testSaveUserPreferenceTest() {
        // given
        Long userId = 9999L; // 임의의 userId
        PreferenceTestRequest request = new PreferenceTestRequest();
        request.setAlcohol_degree(12);
        request.setSweet(3);
        request.setAcidic(2);
        request.setTannin(3);
        request.setBody(4);
        request.setPreferred_types(Arrays.asList("red", "white"));

        // when
        preferenceService.saveUserPreferenceTest(userId, request);

        // then
        // Repository.save()가 제대로 호출되었는지 확인
        ArgumentCaptor<Preference> captor = ArgumentCaptor.forClass(Preference.class);
        verify(preferenceRepository, times(1)).save(captor.capture());

        // 실제로 저장된 엔티티를 가져옴
        Preference savedEntity = captor.getValue();

        // 필드 매핑 검증
        assertThat(savedEntity.getUserId()).isEqualTo(userId);
        assertThat(savedEntity.getAlcoholContent()).isEqualTo(12);
        assertThat(savedEntity.getSweetness()).isEqualTo(3);
        assertThat(savedEntity.getAcidity()).isEqualTo(2);
        assertThat(savedEntity.getTannin()).isEqualTo(3);
        assertThat(savedEntity.getBody()).isEqualTo(4);
        assertThat(savedEntity.getRed()).isTrue();
        assertThat(savedEntity.getWhite()).isTrue();
        assertThat(savedEntity.getSparkling()).isFalse();
        assertThat(savedEntity.getRose()).isFalse();
        assertThat(savedEntity.getFortified()).isFalse();
        assertThat(savedEntity.getEtc()).isFalse();
        assertThat(savedEntity.getCreatedAt()).isNotNull();
        assertThat(savedEntity.getUpdatedAt()).isNull();
    }
}
