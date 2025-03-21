package com.ssafy.winedining.domain.info.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "info_details")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InfoDetail {
    @Id
    private Long id;

    @Column(length = 60)
    private String subtitle;

    // SQL의 "order" 컬럼은 예약어이므로 orderNum으로 사용 (DB 컬럼명은 그대로 지정)
    @Column(name = "\"order\"")
    private Byte orderNum;

    @Lob
    private String content;

    @Column(name = "info_id", nullable = false)
    private Long infoId;
}
