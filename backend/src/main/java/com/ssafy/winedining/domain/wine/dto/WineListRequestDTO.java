package com.ssafy.winedining.domain.wine.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
public class WineListRequestDTO {
    private String keyword;
    private WineListRequestFilterDTO filters;
    private WineListSortDTO sort;
    private Integer page;
    private Integer limit;

}

