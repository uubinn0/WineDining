package com.ssafy.winedining.domain.collection.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "bottles")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Bottle {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "create_at", nullable = false, length = 60)
    private String createAt;

    @Column
    private Boolean best;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "wine_id")
    private Long wineId;

    @Column(name = "custom_wine_id")
    private Long customWineId;
}
