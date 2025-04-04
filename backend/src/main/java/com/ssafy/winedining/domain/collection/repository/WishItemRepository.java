package com.ssafy.winedining.domain.collection.repository;

import com.ssafy.winedining.domain.collection.entity.WishItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WishItemRepository extends JpaRepository<WishItem, Long> {
    List<WishItem> findByUserId(Long userId);
    Optional<WishItem> findByUserIdAndWineId(Long userId, Long wineId);
    void deleteByUserIdAndWineId(Long userId, Long wineId);
    boolean existsByUserIdAndWineId(Long userId, Long wineId);
    void deleteByUserId(Long userId);
}