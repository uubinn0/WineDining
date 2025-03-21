package com.ssafy.winedining.domain.product.entity;

import jakarta.persistence.*;
import lombok.*;
import java.sql.Timestamp;

@Entity
@Table(name = "wines")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Wine {
    @Id
    private Long id;

    @Column(name = "kr_name", nullable = false, length = 255)
    private String krName;

    @Column(name = "en_name", nullable = false, length = 255)
    private String enName;

    @Column(length = 255)
    private String image;

    @Column(length = 60)
    private String country;

    @Lob
    private String grape;

    @Column
    private Long price;

    @Column
    private Byte sweetness;

    @Column
    private Byte acidity;

    @Column
    private Byte tannin;

    @Column
    private Byte body;

    @Column(name = "alcohol_content")
    private Integer alcoholContent;

    @Column(name = "created_at", nullable = false)
    private Timestamp createdAt;

    @Column(name = "type_id", nullable = false)
    private Long typeId;

    @Column(name = "wine_group_id", nullable = false)
    private Long wineGroupId;

    @Column
    private String year;
}
