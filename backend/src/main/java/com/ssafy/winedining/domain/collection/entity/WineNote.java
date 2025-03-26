package com.ssafy.winedining.domain.collection.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "wine_notes")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WineNote {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "who")
    private String who;

    // "when"는 예약어이므로 필드명은 whenField로 사용하고, DB 컬럼명은 그대로 지정
    @Column(name = "`when`")
    private String when;

    @Column(name = "pairing")
    private String pairing;

    @Column(name = "nose")
    private String nose;

    @Column(name = "content")
    private String content;

    @Column(name = "rating")
    private Integer rating;

    @Column(name = "image1")
    private String image1;

    @Column(name = "image2")
    private String image2;

    @Column(name = "image3")
    private String image3;

    @Column(name = "created_at", nullable = false)
    private String createdAt;

    @ManyToOne
    @JoinColumn(name = "bottle_id", nullable = false)
    private Bottle bottle;
}

