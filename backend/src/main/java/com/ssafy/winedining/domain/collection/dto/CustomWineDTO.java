package com.ssafy.winedining.domain.collection.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CustomWineDTO {
    private Long wineId;
    private String image;
    private String name;
    private String type;
    private String country;
    private String grape;
}