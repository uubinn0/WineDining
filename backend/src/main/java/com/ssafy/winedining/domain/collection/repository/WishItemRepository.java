package com.ssafy.winedining.domain.collection.repository;

import com.ssafy.winedining.domain.collection.entity.WishItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@Repository
public interface WishItemRepository extends JpaRepository<WishItem, Long> {
    List<WishItem> findByUserId(Long userId);
    Optional<WishItem> findByUserIdAndWineId(Long userId, Long wineId);
    void deleteByUserIdAndWineId(Long userId, Long wineId);
    boolean existsByUserIdAndWineId(Long userId, Long wineId);
    void deleteByUserId(Long userId);
    @Query("SELECT w.wine.id FROM WishItem w WHERE w.user.id = :userId")
    Set<Long> findWineIdsByUserId(@Param("userId") Long userId);
}