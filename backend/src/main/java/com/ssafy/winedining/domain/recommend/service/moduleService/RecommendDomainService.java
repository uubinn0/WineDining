package com.ssafy.winedining.domain.recommend.service.moduleService;

import com.ssafy.winedining.domain.collection.service.CollectionService;
import com.ssafy.winedining.domain.preference.entity.Preference;
import com.ssafy.winedining.domain.preference.service.PreferenceService;
import com.ssafy.winedining.domain.recommend.dto.RecommendByPreferenceDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RecommendDomainService {

    // 추천 도메인 서비스는 퍼사드 패턴으로 다른 서비스를 호출해서 조합함
    private final PreferenceService preferenceService;
    private final CollectionService collectionService;

    /**
     * DB에서 사용자 취향 테스트 기반한 데이터를 가져옵니다.
     * RecommendByPrefereceDTO로 변환합니다.
     *
     * @param userId
     * @return
     */
    @Transactional(readOnly = true)
    public RecommendByPreferenceDto recommendByPreferene(Long userId) {
        Preference preferenceForRecommend = preferenceService.getPreferenceByUserId(userId);
        return new RecommendByPreferenceDto(preferenceForRecommend);
    }

//    /**
//     * DB에서 사용자 페어링 음식에 기반한 데이터를 가져옵니다.
//     *
//     * @param userId
//     * @return
//     */
//    @Transactional(readOnly = true)
//    public List<RecommendByFoodDto> recommendByFood(Long userId) {
//        return recommendationRepository.findRecommendationByFood(userId);
//    }
//
//    /**
//     * DB에서 사용자 별점 데이터 기반한 데이터를 가져옵니다.
//     *
//     * @param userId
//     * @return
//     */
//    @Transactional(readOnly = true)
//    public List<RecommendByPersonDTO> recommendByPerson(Long userId) {
//        return recommendationRepository.findRecommendationByPerson(userId);
//    }



}
