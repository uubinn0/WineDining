package com.ssafy.winedining.domain.collection.entity;

import com.ssafy.winedining.domain.user.entity.User;
import com.ssafy.winedining.domain.wine.entity.CustomWine;
import com.ssafy.winedining.domain.wine.entity.Wine;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "bottles")
@Getter
@Builder
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Bottle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "create_at", nullable = false)
    private String createAt;

    @Column(name = "best")
    private Boolean best;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "wine_id")
    private Wine wine;

    @ManyToOne
    @JoinColumn(name = "custom_wine_id")
    private CustomWine customWine;
}