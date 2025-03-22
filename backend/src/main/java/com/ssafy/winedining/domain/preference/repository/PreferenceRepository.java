package com.ssafy.winedining.domain.preference.repository;

import com.ssafy.winedining.domain.preference.entity.Preference;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PreferenceRepository extends JpaRepository<Preference, Long> {
}
