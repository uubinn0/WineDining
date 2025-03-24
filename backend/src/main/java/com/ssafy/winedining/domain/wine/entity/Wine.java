package com.ssafy.winedining.domain.wine.entity;

import jakarta.persistence.*;
import lombok.*;
import java.sql.Timestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "wines")
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Wine {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "kr_name", nullable = false)
    private String krName;

    @Column(name = "en_name", nullable = false)
    private String enName;

    private String image;

    private String country;

    private String grape;

    private Integer price;

    private Integer sweetness;

    private Integer acidity;

    private Integer tannin;

    private Integer body;

    @Column(name = "alcohol_content")
    private Integer alcoholContent;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @ManyToOne
    @JoinColumn(name = "type_id", nullable = false)
    private WineType wineType;

    @Column(name = "wine_group_id", nullable = false)
    private Long wineGroupId;

    @Column(name = "year")
    private Integer year;
}