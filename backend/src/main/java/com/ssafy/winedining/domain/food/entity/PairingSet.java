package com.ssafy.winedining.domain.food.entity;

import com.ssafy.winedining.domain.wine.entity.Wine;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "pairing_sets")
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PairingSet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "wine_id", nullable = false)
    private Wine wine;

    @ManyToOne
    @JoinColumn(name = "food_id", nullable = false)
    private Food food;
}
