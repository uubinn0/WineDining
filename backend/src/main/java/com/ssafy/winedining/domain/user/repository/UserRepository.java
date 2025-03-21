package com.ssafy.winedining.domain.user.repository;

import com.ssafy.winedining.domain.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {

    User findByUsername(String username);
}