package com.ssafy.winedining.domain.preference.repository;

import com.ssafy.winedining.domain.preference.entity.Preference;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PreferenceRepository extends JpaRepository<Preference, Long> {

    // UserId를 이용해 추천 테이블 조회
//    Optional<Preference> findByUserId(Long userId);
    List<Preference> findByUserId(Long userId);
    List<Preference> findByUserIdOrderByCreatedAtDesc(Long userId);
    void deleteByUserId(Long userId);
}
