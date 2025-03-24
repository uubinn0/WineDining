package com.ssafy.winedining.domain.wine.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "wine_types")
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WineType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "type_name")
    private String typeName;  // 레드, 화이트, 스파클링, 로제
}