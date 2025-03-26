package com.ssafy.winedining.domain.collection.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NoteRequestDTO {
    private String who;
    private String when;
    private List<String> pairing;
    private String nose;
    private String content;
    private Integer rating;  // BigDecimal 대신 Integer 사용
    private List<String> image;
}