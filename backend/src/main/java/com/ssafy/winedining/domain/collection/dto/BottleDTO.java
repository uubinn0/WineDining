package com.ssafy.winedining.domain.collection.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BottleDTO {
    private Long bottleId;
    private String createdAt;
    private WineDTO wine;
    private CustomWineDTO customWine;
    private boolean isCustom;
    private boolean isBest;
}