package com.ssafy.winedining.domain.wine.dto;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WineResponseDTO {
    private Long wineId;
    private String krName;
    private String enName;
    private String image;
    private String type;
    private String country;
    private String grape;
    private Integer price;
    private Integer sweetness;
    private Integer acidity;
    private Integer tannin;
    private Integer body;
    private Integer alcoholContent;
    private List<String> pairing;

    private String description;
}
