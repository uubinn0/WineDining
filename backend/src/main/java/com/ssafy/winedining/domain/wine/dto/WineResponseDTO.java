package com.ssafy.winedining.domain.wine.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WineResponseDTO {
    private Long wine_id;
    private String kr_name;
    private String en_name;
    private String image;
    private String type;
    private String country;
    private String grape;
    private Integer price;
    private Integer sweetness;
    private Integer acidity;
    private Integer tannin;
    private Integer body;
    private Integer alcohol_content;
    private List<String> pairing;
}
