package com.ssafy.winedining.domain.info.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "infos")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Info {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 60)
    private String type;

    @Column(length = 60)
    private String title;
}
