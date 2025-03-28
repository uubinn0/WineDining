package com.ssafy.winedining.domain.preference.dto.request;

import lombok.Data;

import java.util.List;

@Data
public class PreferenceTestRequest {
    private int alcoholContent;
    private int sweetness;
    private int acidity;
    private int tannin;
    private int body;
    private String preferredTypes;
}
