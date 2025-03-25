package com.ssafy.winedining.domain.collection.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CustomWineCreateDTO {
    private String name;
    private String graph;
    private String country;
    private Long typeId;  // 와인 타입 ID (1: 레드, 2: 화이트, 3: 스파클링, 4: 로제)
    private String grape; // 선택적 필드
}