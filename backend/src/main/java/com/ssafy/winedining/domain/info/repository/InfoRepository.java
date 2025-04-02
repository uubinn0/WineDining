package com.ssafy.winedining.domain.info.repository;

import com.ssafy.winedining.domain.info.entity.Info;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface InfoRepository extends JpaRepository<Info, Long> {
    Page<Info> findByType(String type, Pageable pageable);
    Page<Info> findByTypeStartingWith(String typePrefix, Pageable pageable);
}