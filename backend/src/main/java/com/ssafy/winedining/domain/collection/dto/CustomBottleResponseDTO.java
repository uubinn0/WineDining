package com.ssafy.winedining.domain.collection.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CustomBottleResponseDTO {
    private Long bottle_id;
    private String created_at;
    private WineSimpleDTO wine;

    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class WineSimpleDTO {
        private Long wine_id;
        private String name;
        private String type;
        private String country;
        private String grape;
        private String image;
    }

}