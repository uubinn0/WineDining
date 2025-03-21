package com.ssafy.winedining.domain.user.entity;

import jakarta.persistence.*;
import lombok.*;
import java.sql.Timestamp;

@Entity
@Table(name = "preferences")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Preference {
    @Id
    private Long id;

    @Id
    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "alcohol_content")
    private Byte alcoholContent;

    @Column
    private Byte sweetness;

    @Column
    private Byte acidity;

    @Column
    private Byte tannin;

    @Column
    private Byte body;

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
}
