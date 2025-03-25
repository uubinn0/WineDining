package com.ssafy.winedining.domain.wine.service;

import com.ssafy.winedining.domain.food.entity.Food;
import com.ssafy.winedining.domain.food.repository.PairingSetRepository;
import com.ssafy.winedining.domain.wine.dto.WineResponseDTO;
import com.ssafy.winedining.domain.wine.entity.Wine;
import com.ssafy.winedining.domain.wine.repository.WineRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WineService {

    private final WineRepository wineRepository;
    private final PairingSetRepository pairingSetRepository;

    @Transactional(readOnly = true)
    public WineResponseDTO getWineDetail(Long wineId) {
        // 와인 정보 조회
        Wine wine = wineRepository.findById(wineId)
                .orElseThrow(() -> new NoSuchElementException("존재하지 않는 와인입니다."));

        // 와인과 어울리는 음식 조회
        List<Food> pairingFoods = pairingSetRepository.findFoodsByWineId(wineId);
        List<String> pairingFoodNames = pairingFoods.stream()
                .map(Food::getFoodName)
                .collect(Collectors.toList());

        // 와인 타입 이름 가져오기 (레드, 화이트, 스파클링, 로제)
        String typeName = wine.getWineType().getTypeName();

        return WineResponseDTO.builder()
                .wine_id(wine.getId())
                .kr_name(wine.getKrName())
                .en_name(wine.getEnName())
                .image(wine.getImage())
                .type(typeName)
                .country(wine.getCountry())
                .grape(wine.getGrape())
                .price(wine.getPrice())
                .sweetness(wine.getSweetness())
                .acidity(wine.getAcidity())
                .tannin(wine.getTannin())
                .body(wine.getBody())
                .alcohol_content(wine.getAlcoholContent())
                .pairing(pairingFoodNames)
                .build();
    }
}