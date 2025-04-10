package com.ssafy.winedining.domain.user.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "ranks")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class Rank {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // 이 부분이 올바르게 설정되었는지 확인
    private Long id;

    private Byte condition;

    @Column(length = 60)
    private String name;
}
