package com.ssafy.winedining.domain.food.repository;

import com.ssafy.winedining.domain.food.entity.Food;
import com.ssafy.winedining.domain.food.entity.PairingSet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PairingSetRepository extends JpaRepository<PairingSet, Long> {

    @Query("SELECT f FROM Food f JOIN PairingSet ps ON f.id = ps.food.id WHERE ps.wine.id = :wineId")
    List<Food> findFoodsByWineId(@Param("wineId") Long wineId);
}