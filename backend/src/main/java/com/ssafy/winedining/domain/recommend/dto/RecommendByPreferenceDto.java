package com.ssafy.winedining.domain.recommend.dto;

import com.ssafy.winedining.domain.user.entity.Preference;
import lombok.Data;

import java.util.Date;

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
    private boolean fortified;
    private boolean etc;

    public RecommendByPreferenceDto(Preference preference){
        this.userId = preference.getUserId();
        this.alcoholContent = preference.getAlcoholContent() != null ? preference.getAlcoholContent() : 0;
        this.sweetness = preference.getSweetness() != null ? preference.getSweetness() : 0;
        this.acidity = preference.getAcidity() != null ? preference.getAcidity() : 0;
        this.tannin = preference.getTannin() != null ? preference.getTannin() : 0;
        this.body = preference.getBody() != null ? preference.getBody() : 0;
        this.red = preference.getRed() != null ? preference.getRed() : false;
        this.white = preference.getWhite() != null ? preference.getWhite() : false;
        this.sparkling = preference.getSparkling() != null ? preference.getSparkling() : false;
        this.rose = preference.getRose() != null ? preference.getRose() : false;
        this.fortified = preference.getFortified() != null ? preference.getFortified() : false;
        this.etc = preference.getEtc() != null ? preference.getEtc() : false;
    }

}
