package com.ssafy.winedining.domain.recommend.dto;

import com.ssafy.winedining.domain.collection.entity.Bottle;
import com.ssafy.winedining.domain.wine.entity.Wine;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class RecommendByPersonDTO {

    private Long id;
    private String krName;
    private String enName;
    private String image;
    private String country;
    private String grape;
    private Integer price;
    private Integer sweetness;
    private Integer acidity;
    private Integer tannin;
    private Integer body;
    private Integer alcoholContent;
    private Long typeId;
    private Long wineGroupId;
    private Integer year;
    private Double averageRating;

    public RecommendByPersonDTO(Wine wine, Double averageRating) {
        this.id = wine.getId();
        this.krName = wine.getKrName();
        this.enName = wine.getEnName();
        this.image = wine.getImage();
        this.country = wine.getCountry();
        this.grape = wine.getGrape();
        this.price = wine.getPrice();
        this.sweetness = wine.getSweetness();
        this.acidity = wine.getAcidity();
        this.tannin = wine.getTannin();
        this.body = wine.getBody();
        this.alcoholContent = wine.getAlcoholContent();
        this.typeId = wine.getWineType().getId();
        this.wineGroupId = wine.getWineGroupId();
        this.year = wine.getYear();
        this.averageRating = (averageRating != null) ? averageRating : 0.0;
    }

}
