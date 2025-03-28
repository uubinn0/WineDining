package com.ssafy.winedining.domain.recommend.dto;

import com.ssafy.winedining.domain.preference.entity.Preference;
import lombok.Data;

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

}
