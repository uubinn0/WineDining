package com.ssafy.winedining.domain.collection.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BottleResponseDTO {
    private Long bottleId;
    private String createdAt;
    private WineSimpleDTO wine;

    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class WineSimpleDTO {
        private Long wineId;
        private String name;
        private String type;
        private String country;
        private String grape;
        private String image;
    }
}