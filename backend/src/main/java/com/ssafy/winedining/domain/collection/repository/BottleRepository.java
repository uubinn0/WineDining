package com.ssafy.winedining.domain.collection.repository;

import com.ssafy.winedining.domain.collection.entity.Bottle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BottleRepository extends JpaRepository<Bottle, Long> {
    List<Bottle> findByUserId(Long userId);
    List<Bottle> findByUserIdAndBestIsTrue(Long userId);
}