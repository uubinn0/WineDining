package com.ssafy.winedining.domain.user.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "ranks")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Rank {
    @Id
    private Long id;

    @Column(length = 60)
    private String name;

    @Column
    private Byte condition; // TINYINT -> Byte
}
