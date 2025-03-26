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
public class NoteResponseDTO {
    private Long noteId;
    private String createdAt;
    private String who;
    private String when;
    private List<String> pairing;
    private String nose;
    private Integer rating;  // BigDecimal 대신 Integer 사용
    private String content;
    private List<String> image;
}