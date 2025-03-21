package com.ssafy.winedining.domain.product.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "wine_types")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WineType {
    @Id
    private Long id;

    @Column(name = "type_name", length = 60)
    private String typeName;
}
