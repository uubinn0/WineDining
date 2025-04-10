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
    private String name;
    private String grape;
    private String country;
    private String typeId;
}