package com.ssafy.winedining.domain.collection.service;

import com.ssafy.winedining.domain.collection.dto.*;
import com.ssafy.winedining.domain.collection.entity.Bottle;
import com.ssafy.winedining.domain.collection.repository.BottleRepository;
import com.ssafy.winedining.domain.user.entity.Rank;
import com.ssafy.winedining.domain.user.entity.User;
import com.ssafy.winedining.domain.user.repository.RankRepository;
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
    private final RankRepository rankRepository;

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

        // 사용자의 총 병 개수 계산
        int totalBottles = bottleRepository.findByUserId(userId).size();

        // 현재 병 개수에 맞는 등급 찾기
        Rank newRank = rankRepository.findRankByBottleCount(totalBottles);

        // 사용자 등급 업데이트
        if (newRank != null && (user.getRank() == null || !user.getRank().getId().equals(newRank.getId()))) {
            user.setRank(newRank);
            userRepository.save(user);
        }

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

        // 와인 타입 확인
        WineType wineType = wineTypeRepository.findById(customWineDTO.getTypeId())
                .orElseThrow(() -> new NoSuchElementException("존재하지 않는 와인 타입입니다."));

        // 커스텀 와인 생성
        CustomWine customWine = CustomWine.builder()
                .name(customWineDTO.getName())
                .grape(customWineDTO.getGrape())
                .country(customWineDTO.getCountry())
                .createdAt(LocalDateTime.now().toString())
                .wineType(wineType)
                .build();

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

        // 사용자의 총 병 개수 계산
        int totalBottles = bottleRepository.findByUserId(userId).size();

        // 현재 병 개수에 맞는 등급 찾기
        Rank newRank = rankRepository.findRankByBottleCount(totalBottles);

        // 사용자 등급 업데이트
        if (newRank != null && (user.getRank() == null || !user.getRank().getId().equals(newRank.getId()))) {
            user.setRank(newRank);
            userRepository.save(user);
        }

        // 응답 DTO 생성
        return CustomBottleResponseDTO.builder()
                .bottleId(savedBottle.getId())
                .createdAt(savedBottle.getCreateAt())
                .wine(
                        CustomBottleResponseDTO.WineSimpleDTO.builder()
                                .wineId(savedCustomWine.getId())
                                .name(savedCustomWine.getName())
                                .type(savedCustomWine.getWineType().getTypeName())
                                .country(savedCustomWine.getCountry())
                                .grape(customWineDTO.getGrape())  // 커스텀 와인에 포도 정보 추가
                                .build()
                )
                .build();
    }

    /**
     * 
     * 사용자의 모든 병(와인 + 커스텀 와인) 조회
     */
    @Transactional(readOnly = true)
    public CellarResponseDTO getUserBottles(Long userId) {
        // 사용자 확인
        userRepository.findById(userId)
                .orElseThrow(() -> new NoSuchElementException("존재하지 않는 사용자입니다."));

        // 사용자의 모든 병 조회 - 생성일 기준 내림차순 정렬
        List<Bottle> bottles = bottleRepository.findByUserIdOrderByCreateAtDesc(userId);

        // 병 정보를 BottleDTO 리스트로 변환
        List<BottleDTO> bottleDTOs = bottles.stream().map(bottle -> {
            if (bottle.getWine() != null) {
                // 일반 와인인 경우
                Wine wine = bottle.getWine();
                return BottleDTO.builder()
                        .bottleId(bottle.getId())
                        .createdAt(bottle.getCreateAt())
                        .isCustom(false)
                        .isBest(bottle.getBest() != null ? bottle.getBest() : false)
                        .wine(
                                WineDTO.builder()
                                        .wineId(wine.getId())
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
                return BottleDTO.builder()
                        .bottleId(bottle.getId())
                        .createdAt(bottle.getCreateAt())
                        .isCustom(true)
                        .isBest(bottle.getBest() != null ? bottle.getBest() : false)
                        .wine(
                                WineDTO.builder()
                                        .wineId(customWine.getId())
                                        .name(customWine.getName())
                                        .type(customWine.getWineType().getTypeName())
                                        .country(customWine.getCountry())
                                        .grape(customWine.getGrape())
                                        .image(null) // 커스텀 와인은 image null로 설정
                                        .build()
                        )
                        .build();
            }
        }).collect(Collectors.toList());

        // CellarResponseDTO 생성 및 반환
        return CellarResponseDTO.builder()
                .bottles(bottleDTOs)
                .totalCount(bottleDTOs.size())
                .build();
    }

    /**
     * 베스트 와인 조회
     */
    @Transactional(readOnly = true)
    public CellarResponseDTO getBestWines(Long userId) {
        // 사용자 확인
        userRepository.findById(userId)
                .orElseThrow(() -> new NoSuchElementException("존재하지 않는 사용자입니다."));

        // 사용자의 베스트 와인 병 조회
        List<Bottle> bestBottles = bottleRepository.findByUserIdAndBestIsTrue(userId);

        // DTO 변환
        List<BottleDTO> bottleDTOs = bestBottles.stream()
                .map(bottle -> {
                    if (bottle.getWine() != null) {
                        // 일반 와인인 경우
                        Wine wine = bottle.getWine();
                        return BottleDTO.builder()
                                .bottleId(bottle.getId())
                                .createdAt(bottle.getCreateAt())
                                .isCustom(false)
                                .isBest(true)
                                .wine(
                                        WineDTO.builder()
                                                .wineId(wine.getId())
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
                        return BottleDTO.builder()
                                .bottleId(bottle.getId())
                                .createdAt(bottle.getCreateAt())
                                .isCustom(true)
                                .isBest(true)
                                .wine(
                                        WineDTO.builder()
                                                .wineId(customWine.getId())
                                                .name(customWine.getName())
                                                .type(customWine.getWineType().getTypeName())
                                                .country(customWine.getCountry())
                                                .grape(null)
                                                .build()
                                )
                                .build();
                    }
                })
                .collect(Collectors.toList());

        // 응답 구성
        return CellarResponseDTO.builder()
                .bottles(bottleDTOs)
                .totalCount(bottleDTOs.size())
                .build();
    }

    /**
     * 베스트 와인 등록/해제
     */
    @Transactional
    public void updateBestWineStatus(Long userId, Long bottleId, boolean setBest) {
        // 병 조회 (사용자 확인)
        Bottle bottle = bottleRepository.findById(bottleId)
                .orElseThrow(() -> new NoSuchElementException("존재하지 않는 병입니다."));

        // 사용자 권한 확인
        if (!bottle.getUser().getId().equals(userId)) {
            throw new IllegalArgumentException("해당 병에 대한 접근 권한이 없습니다.");
        }

        // 베스트 상태 업데이트
        bottle.setBest(setBest);

        // 저장
        bottleRepository.save(bottle);
    }
}