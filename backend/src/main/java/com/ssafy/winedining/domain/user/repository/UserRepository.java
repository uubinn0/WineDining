package com.ssafy.winedining.domain.user.repository;

import com.ssafy.winedining.domain.preference.entity.Preference;
import com.ssafy.winedining.domain.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    User findByUsername(String username);
    User findByEmail(String email);

}