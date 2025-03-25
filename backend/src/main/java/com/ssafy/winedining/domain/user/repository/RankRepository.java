package com.ssafy.winedining.domain.user.repository;

import com.ssafy.winedining.domain.user.entity.Rank;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RankRepository extends JpaRepository<Rank, Long> {
    Optional<Rank> findByName(String name);
}
