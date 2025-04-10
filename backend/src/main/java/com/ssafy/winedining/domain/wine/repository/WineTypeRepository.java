package com.ssafy.winedining.domain.wine.repository;

import com.ssafy.winedining.domain.wine.entity.WineType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface WineTypeRepository extends JpaRepository<WineType, Long> {
}