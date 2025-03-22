package com.ssafy.winedining.domain.wine.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "custom_wines")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CustomWine {
    @Id
    private Long id;

    @Column(nullable = false, length = 255)
    private String name;

    @Column(length = 60)
    private String graph;

    @Column(length = 60)
    private String country;

    @Column(name = "created_at", length = 60)
    private String createdAt;

    @Column(name = "type_id", nullable = false)
    private Long typeId;
}
