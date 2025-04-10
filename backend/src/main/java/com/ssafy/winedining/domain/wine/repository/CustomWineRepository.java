package com.ssafy.winedining.domain.wine.repository;

import com.ssafy.winedining.domain.wine.entity.CustomWine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CustomWineRepository extends JpaRepository<CustomWine, Long> {
}