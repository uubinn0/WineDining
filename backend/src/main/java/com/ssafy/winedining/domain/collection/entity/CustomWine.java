package com.ssafy.winedining.domain.collection.entity;

import com.ssafy.winedining.domain.wine.entity.WineType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "custom_wines")
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CustomWine {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "graph")
    private String graph;

    @Column(name = "country")
    private String country;

    @Column(name = "created_at")
    private String createdAt;

    @ManyToOne
    @JoinColumn(name = "type_id", nullable = false)
    private WineType wineType;
}