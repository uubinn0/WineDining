package com.ssafy.winedining.domain.preference.entity;

import com.ssafy.winedining.domain.recommend.dto.request.PreferenceTestRequest;
import jakarta.persistence.*;
import lombok.*;
import java.sql.Timestamp;

@Entity
@Table(name = "preferences")
@Data
@Builder
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
}
