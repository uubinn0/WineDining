package com.ssafy.winedining.domain.user.repository;

import com.ssafy.winedining.domain.user.entity.Rank;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface RankRepository extends JpaRepository<Rank, Long> {
    Optional<Rank> findByName(String name);
    @Query("SELECT r FROM Rank r WHERE r.condition <= :bottleCount ORDER BY r.condition DESC LIMIT 1")
    Rank findRankByBottleCount(int bottleCount);
    Rank findTopByConditionLessThanEqualOrderByConditionDesc(int bottleCount);
}
