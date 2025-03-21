package com.ssafy.winedining.domain.recommend.repository;

import com.ssafy.winedining.domain.recommend.dto.RecommendByFoodDto;
import com.ssafy.winedining.domain.recommend.dto.RecommendByPersonDTO;
import com.ssafy.winedining.domain.recommend.dto.RecommendByPreferenceDto;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RecommendationRepository {

    @Query("SELECT new com.ssafy.winedining.domain.recommend.dto.RecommendByPreferenceDto(p) " +
            "FROM Preference p " +
            "WHERE p.userId = :userId")
    List<RecommendByPreferenceDto> findRecommendationByPreference(@Param("userId") Long userId);

    @Query("SELECT new com.ssafy.winedining.domain.recommend.dto.RecommendByFoodDto(p) " +
            "FROM Preference p " +
            "WHERE p.userId = :userId")
    List<RecommendByFoodDto> findRecommendationByFood(@Param("userId") Long userId);

    @Query("SELECT new com.ssafy.winedining.domain.recommend.dto.RecommendByPersonDTO(" +
            "w, AVG(n.rating)) " +
            "FROM Bottle b JOIN b.wine w LEFT JOIN b.wineNotes n " +
            "WHERE b.userId = :userId " +
            "GROUP BY w")
    List<RecommendByPersonDTO> findRecommendationByPerson(@Param("userId") Long userId);

}
