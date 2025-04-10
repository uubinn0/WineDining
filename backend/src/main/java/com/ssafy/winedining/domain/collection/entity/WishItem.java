package com.ssafy.winedining.domain.collection.entity;

import com.ssafy.winedining.domain.user.entity.User;
import com.ssafy.winedining.domain.wine.entity.Wine;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "wish_items")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WishItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "created_at", nullable = false)
    private String createdAt;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "wine_id", nullable = false)
    private Wine wine;
}