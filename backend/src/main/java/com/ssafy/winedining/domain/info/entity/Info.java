package com.ssafy.winedining.domain.info.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "infos")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Info {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "type", nullable = false)
    private String type;

    @Column(name = "title")
    private String title;

    @OneToMany(mappedBy = "info", fetch = FetchType.LAZY)
    private List<InfoDetail> details;
}