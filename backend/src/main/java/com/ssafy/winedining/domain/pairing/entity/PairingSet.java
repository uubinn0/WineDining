package com.ssafy.winedining.domain.pairing.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PairingSet {
    @Id
    private Long id;

    @Id
    @Column(name = "wine_id")
    private Long wineId;

    @Id
    @Column(name = "food_id")
    private Long foodId;
}

