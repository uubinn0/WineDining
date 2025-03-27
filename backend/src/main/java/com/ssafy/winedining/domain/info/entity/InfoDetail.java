package com.ssafy.winedining.domain.info.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "info_details")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InfoDetail {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "subtitle")
    private String subtitle;

    @Column(name = "`order`")
    private Integer order;

    @Column(name = "content")
    private String content;

    @ManyToOne
    @JoinColumn(name = "info_id", nullable = false)
    private Info info;
}