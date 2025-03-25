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
    private Long bottle_id;
    private String created_at;
    private WineDTO wine;
    private CustomWineDTO custom_wine;
    private boolean is_custom;
    private boolean is_best;
}