package com.ssafy.winedining.global.auth.repository;

import com.ssafy.winedining.domain.user.entity.User;
import com.ssafy.winedining.global.auth.entity.Auth;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AuthRepository extends JpaRepository<Auth, Integer> {

    void deleteByUser_UserId(Long userId);

    Optional<Auth> findByUser(User user);
}

