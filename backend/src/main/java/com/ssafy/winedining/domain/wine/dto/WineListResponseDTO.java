package com.ssafy.winedining.domain.wine.dto;

import lombok.Data;

import java.util.List;

@Data
public class WineListResponseDTO {
    private List<WineListItemDTO> wines;
    private Integer totalCount;
    private Integer page;
    private Integer totalPages;
    private Integer Limit;
}
