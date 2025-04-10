package com.ssafy.winedining.domain.info.repository;

import com.ssafy.winedining.domain.info.entity.InfoDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InfoDetailRepository extends JpaRepository<InfoDetail, Long> {
    List<InfoDetail> findByInfoIdOrderByOrder(Long infoId);
}