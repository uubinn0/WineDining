package com.ssafy.winedining.domain.preference.dto.request;

import lombok.Data;

import java.util.List;

@Data
public class PreferenceTestRequest {
    private int alcoholDegree;
    private int sweet;
    private int acidic;
    private int body;
    private int tannin;
    private List<String> preferredTypes;
}
