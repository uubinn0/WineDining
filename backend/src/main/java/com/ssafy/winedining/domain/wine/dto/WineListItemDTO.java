package com.ssafy.winedining.domain.wine.dto;

import lombok.Data;

@Data
public class WineListItemDTO {
    private Long wineId;
    private String name;
    private String image;
    private String type;
    private String country;
    private String grape;
    private boolean isWish;
}
