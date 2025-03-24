package com.ssafy.winedining.domain.collection.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "wish_items")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WishItem {
    @Id
    private Long id;

    @Column(name = "created_at", nullable = false, length = 60)
    private String createdAt;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "wine_id", nullable = false)
    private Long wineId;
}
