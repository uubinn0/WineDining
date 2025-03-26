package com.ssafy.winedining.domain.collection.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BottleNotesResponseDTO {
    private BottleInfo bottle;
    private List<NoteResponseDTO> notes;

    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class BottleInfo {
        private Long bottleId;
        private String createdAt;
        private WineDTO wine;
        private boolean isCustom;
        private boolean isBest;
        private int totalNote;
    }
}