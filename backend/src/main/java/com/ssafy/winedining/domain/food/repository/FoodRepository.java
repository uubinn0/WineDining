package com.ssafy.winedining.domain.food.repository;

import com.ssafy.winedining.domain.food.entity.Food;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FoodRepository extends JpaRepository<Food, Long> {
    Optional<Food> findByFoodName(String foodName);
    Optional<Food> findByFoodNameContaining(String foodName);
}