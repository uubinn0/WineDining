package com.ssafy.winedining.domain.collection.repository;

import com.ssafy.winedining.domain.collection.entity.WishItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WishItemRepository extends JpaRepository<WishItem, Long> {
    boolean existsByWineIdAndUserId(Long wineId, Long userId);
}
