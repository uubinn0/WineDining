//package com.ssafy.winedining.domain.recommend.service.moduleService;
//
//import com.ssafy.winedining.domain.recommend.dto.RecommendByFoodDto;
//import com.ssafy.winedining.domain.recommend.dto.RecommendByPersonDTO;
//import com.ssafy.winedining.domain.recommend.dto.RecommendByPreferenceDto;
//import com.ssafy.winedining.domain.recommend.repository.RecommendationRepository;
//import lombok.RequiredArgsConstructor;
//import org.springframework.stereotype.Service;
//import org.springframework.transaction.annotation.Transactional;
//
//import java.util.List;
//
//@Service
//@RequiredArgsConstructor
//public class RecommendDomainService {
//
//    private final RecommendationRepository recommendationRepository;
//
//    /**
//     * DB에서 사용자 취향 테스트 기반한 데이터를 가져옵니다.
//     *
//     * @param userId
//     * @return
//     */
//    @Transactional(readOnly = true)
//    public List<RecommendByPreferenceDto> recommendByPreferene(Long userId) {
//        return recommendationRepository.findRecommendationByPreference(userId);
//    }
//
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
//
//
//
//}
