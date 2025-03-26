package com.ssafy.winedining.domain.collection.service;

import com.ssafy.winedining.domain.collection.dto.BottleResponseDTO;
import com.ssafy.winedining.domain.collection.dto.CustomBottleResponseDTO;
import com.ssafy.winedining.domain.collection.dto.CustomWineCreateDTO;
import com.ssafy.winedining.domain.collection.entity.Bottle;
import com.ssafy.winedining.domain.collection.repository.BottleRepository;
import com.ssafy.winedining.domain.user.entity.User;
import com.ssafy.winedining.domain.user.repository.UserRepository;
import com.ssafy.winedining.domain.wine.entity.CustomWine;
import com.ssafy.winedining.domain.wine.entity.Wine;
import com.ssafy.winedining.domain.wine.entity.WineType;
import com.ssafy.winedining.domain.wine.repository.CustomWineRepository;
import com.ssafy.winedining.domain.wine.repository.WineRepository;
import com.ssafy.winedining.domain.wine.repository.WineTypeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CellarService {

    private final BottleRepository bottleRepository;
    private final WineRepository wineRepository;
    private final CustomWineRepository customWineRepository;
    private final WineTypeRepository wineTypeRepository;
    private final UserRepository userRepository;

    /**
     * 기존 와인을 사용자 셀러에 추가
     */
    @Transactional
    public BottleResponseDTO addWineToBottle(Long userId, Long wineId) {
        // 사용자 확인
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NoSuchElementException("존재하지 않는 사용자입니다."));

        // 와인 확인
        Wine wine = wineRepository.findById(wineId)
                .orElseThrow(() -> new NoSuchElementException("존재하지 않는 와인입니다."));

        // 새로운 병 생성 및 저장
        Bottle bottle = Bottle.builder()
                .createAt(LocalDateTime.now().toString())
                .best(false)
                .user(user)
                .wine(wine)
                .customWine(null)
                .build();

        Bottle savedBottle = bottleRepository.save(bottle);

        // 와인 타입 이름 가져오기
        String typeName = wine.getWineType().getTypeName();

        // 응답 DTO 생성
        return BottleResponseDTO.builder()
                .bottleId(savedBottle.getId())
                .createdAt(savedBottle.getCreateAt())
                .wine(
                        BottleResponseDTO.WineSimpleDTO.builder()
                                .wineId(wine.getId())
                                .name(wine.getKrName())
                                .type(typeName)
                                .country(wine.getCountry())
                                .grape(wine.getGrape())
                                .image(wine.getImage())
                                .build()
                )
                .build();
    }

    /**
     * 커스텀 와인 생성 및 셀러에 추가
     */
    @Transactional
    public CustomBottleResponseDTO createCustomWineAndAddToBottle(Long userId, CustomWineCreateDTO customWineDTO) {
        // 사용자 확인
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NoSuchElementException("존재하지 않는 사용자입니다."));
        System.out.println("111111111");
        // 와인 타입 확인
        WineType wineType = wineTypeRepository.findById(customWineDTO.getTypeId())
                .orElseThrow(() -> new NoSuchElementException("존재하지 않는 와인 타입입니다."));
        System.out.println("22222222");
        // 커스텀 와인 생성
        CustomWine customWine = CustomWine.builder()
                .name(customWineDTO.getName())
                .grape(customWineDTO.getGraph())
                .country(customWineDTO.getCountry())
                .createdAt(LocalDateTime.now().toString())
                .wineType(wineType)
                .build();
        System.out.println("22222222");
        CustomWine savedCustomWine = customWineRepository.save(customWine);

        // 병에 추가
        Bottle bottle = Bottle.builder()
                .createAt(LocalDateTime.now().toString())
                .best(false)
                .user(user)
                .wine(null)
                .customWine(savedCustomWine)
                .build();

        Bottle savedBottle = bottleRepository.save(bottle);
        System.out.println("444444444444");
        // 응답 DTO 생성
        return CustomBottleResponseDTO.builder()
                .bottle_id(savedBottle.getId())
                .created_at(savedBottle.getCreateAt())
                .wine(
                        CustomBottleResponseDTO.WineSimpleDTO.builder()
                                .wine_id(savedCustomWine.getId())
                                .name(savedCustomWine.getName())
                                .type(savedCustomWine.getWineType().getTypeName())
                                .country(savedCustomWine.getCountry())
                                .grape(customWineDTO.getGrape())  // 커스텀 와인에 포도 정보 추가
                                .image(customWineDTO.getGraph())  // 그래프를 이미지로 사용
                                .build()
                )
                .build();
    }

    /**
     * 사용자의 모든 병(와인 + 커스텀 와인) 조회
     */
    @Transactional(readOnly = true)
    public List<CustomBottleResponseDTO> getUserBottles(Long userId) {
        // 사용자 확인
        userRepository.findById(userId)
                .orElseThrow(() -> new NoSuchElementException("존재하지 않는 사용자입니다."));

        // 사용자의 모든 병 조회
        List<Bottle> bottles = bottleRepository.findByUserId(userId);

        // 응답 DTO 변환
        return bottles.stream().map(bottle -> {
            if (bottle.getWine() != null) {
                // 일반 와인인 경우
                Wine wine = bottle.getWine();
                return CustomBottleResponseDTO.builder()
                        .bottle_id(bottle.getId())
                        .created_at(bottle.getCreateAt())
                        .wine(
                                CustomBottleResponseDTO.WineSimpleDTO.builder()
                                        .wine_id(wine.getId())
                                        .name(wine.getKrName())
                                        .type(wine.getWineType().getTypeName())
                                        .country(wine.getCountry())
                                        .grape(wine.getGrape())
                                        .image(wine.getImage())
                                        .build()
                        )
                        .build();
            } else {
                // 커스텀 와인인 경우
                CustomWine customWine = bottle.getCustomWine();
                return CustomBottleResponseDTO.builder()
                        .bottle_id(bottle.getId())
                        .created_at(bottle.getCreateAt())
                        .wine(
                                CustomBottleResponseDTO.WineSimpleDTO.builder()
                                        .wine_id(customWine.getId())
                                        .name(customWine.getName())
                                        .type(customWine.getWineType().getTypeName())
                                        .country(customWine.getCountry())
                                        .grape(null)
                                        .image(customWine.getGrape()) // 커스텀 와인의 graph를 image로 사용
                                        .build()
                        )
                        .build();
            }
        }).collect(Collectors.toList());
    }
}