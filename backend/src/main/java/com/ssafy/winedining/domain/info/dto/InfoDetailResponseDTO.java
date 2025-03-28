package com.ssafy.winedining.domain.info.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InfoDetailResponseDTO {
    private Long id;
    private String title;
    private String content;
}