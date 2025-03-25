package com.ssafy.winedining.domain.preference.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;

@Entity
@Table(name = "preferences")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Preference {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "alcohol_content")
    private int alcoholContent;

    @Column
    private int sweetness;

    @Column
    private int acidity;

    @Column
    private int tannin;

    @Column
    private int body;

    @Column
    private Boolean red;

    @Column
    private Boolean white;

    @Column
    private Boolean sparkling;

    @Column
    private Boolean rose;

    @Column
    private Boolean fortified;

    @Column
    private Boolean etc;

    @Column(name = "created_at", nullable = false)
    private Timestamp createdAt;

    @Column(name = "updated_at")
    private Timestamp updatedAt;

    @Builder
    public Preference(Long userId, int alcoholContent, int sweetness, int acidity, int tannin, int body, boolean red,
                      boolean white, boolean sparkling, boolean rose, boolean fortified, boolean etc,
                      Timestamp createdAt, Timestamp updatedAt){
        this.userId = userId;
        this.alcoholContent = alcoholContent;
        this.sweetness = sweetness;
        this.acidity = acidity;
        this.tannin = tannin;
        this.body = body;
        this.red = red;
        this.white = white;
        this.sparkling = sparkling;
        this.rose = rose;
        this.fortified = fortified;
        this.etc = etc;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }



}
