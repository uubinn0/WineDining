package com.ssafy.winedining.domain.product.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "foods")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Food {
    @Id
    private Long id;

    @Column(name = "food_name", length = 60)
    private String foodName;
}

