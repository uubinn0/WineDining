package com.ssafy.winedining.domain.recommend.dto.request;

import lombok.Data;

import java.util.List;

@Data
public class PreferenceTestRequest {
    private int alcohol_degree;
    private int sweet;
    private int acidic;
    private int body;
    private int tannin;
    private List<String> preferred_types;
}
