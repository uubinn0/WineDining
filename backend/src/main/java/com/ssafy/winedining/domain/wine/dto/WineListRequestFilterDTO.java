package com.ssafy.winedining.domain.wine.dto;

import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class WineListRequestFilterDTO {
    private List<String> type = new ArrayList<>();
    private List<String> grape = new ArrayList<>();
    private List<String> country = new ArrayList<>();
    private Integer minPrice;
    private Integer maxPrice;
    private Integer minSweetness;
    private Integer maxSweetness;
    private Integer minAcidity;
    private Integer maxAcidity;
    private Integer minTannin;
    private Integer maxTannin;
    private Integer minBody;
    private Integer maxBody;
    private List<String> pairing = new ArrayList<>();
}
