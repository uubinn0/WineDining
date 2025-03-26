package com.ssafy.winedining.domain.wine.repository;

import com.ssafy.winedining.domain.wine.entity.Wine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface WineRepository extends JpaRepository<Wine, Long>, JpaSpecificationExecutor<Wine> {
    // 기본 CRUD 메서드 외에 추가 메서드가 필요하면 여기에 추가

}
