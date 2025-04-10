package com.ssafy.winedining.domain.info.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InfoListResponseDTO {
    private List<InfoSummaryDTO> infos;
    private int totalCount;
    private int page;
    private int totalPages;
    private int limit;

    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class InfoSummaryDTO {
        private Long id;
        private String title;
    }
}