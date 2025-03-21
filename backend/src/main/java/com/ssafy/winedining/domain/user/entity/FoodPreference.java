package com.ssafy.winedining.domain.user.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "food_preference")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FoodPreference {
    @Id
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "food_id", nullable = false)
    private Long foodId;

    @Column(name = "created_at", length = 60)
    private String createdAt;

    @Column(length = 60)
    private String input;
}
