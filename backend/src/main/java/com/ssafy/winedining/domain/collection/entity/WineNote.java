package com.ssafy.winedining.domain.collection.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "wine_notes")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WineNote {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 60)
    private String who;

    // "when"는 예약어이므로 필드명은 whenField로 사용하고, DB 컬럼명은 그대로 지정
    @Column(name = "\"when\"", length = 60)
    private String whenField;

    @Column(length = 60)
    private String pairing;

    @Column(length = 100)
    private String nose;

    @Lob
    private String content;

    @Column(precision = 2, scale = 1)
    private Double rating;

    @Column(length = 255)
    private String image1;

    @Column(length = 255)
    private String image2;

    @Column(length = 255)
    private String image3;

    @Column(name = "created_at", nullable = false, length = 60)
    private String createdAt;

    @Column(name = "bottle_id", nullable = false)
    private Long bottleId;
}

