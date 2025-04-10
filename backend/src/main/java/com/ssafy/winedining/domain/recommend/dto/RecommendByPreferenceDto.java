package com.ssafy.winedining.domain.recommend.dto;

import com.ssafy.winedining.domain.preference.entity.Preference;
import lombok.Data;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Data
public class RecommendByPreferenceDto {

    private Long userId;
    private int alcoholContent;
    private int sweetness;
    private int acidity;
    private int tannin;
    private int body;
    private boolean red;
    private boolean white;
    private boolean sparkling;
    private boolean rose;
    private List<Long> foodIds = new ArrayList<>(); // 새로 추가된 필드

    public RecommendByPreferenceDto(Preference preference){
        this.userId = preference.getUserId();
        this.alcoholContent = preference.getAlcoholContent();
        this.sweetness = preference.getSweetness();
        this.acidity = preference.getAcidity();
        this.tannin = preference.getTannin();
        this.body = preference.getBody();
        this.red = preference.getRed();
        this.white = preference.getWhite();
        this.sparkling = preference.getSparkling();
        this.rose = preference.getRose();
    }

    // 음식 ID 목록을 설정하는 메서드
    public void setFoodIds(List<Long> foodIds) {
        if (foodIds != null) {
            this.foodIds = foodIds;
        }
    }
}
