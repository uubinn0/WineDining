package com.ssafy.winedining.domain.collection.service;

import com.ssafy.winedining.domain.collection.dto.BottleResponseDTO;
import com.ssafy.winedining.domain.collection.entity.Bottle;
import com.ssafy.winedining.domain.collection.repository.BottleRepository;
import com.ssafy.winedining.domain.user.entity.User;
import com.ssafy.winedining.domain.user.repository.UserRepository;
import com.ssafy.winedining.domain.wine.entity.Wine;
import com.ssafy.winedining.domain.wine.repository.WineRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
public class BottleService {

    private final BottleRepository bottleRepository;
    private final WineRepository wineRepository;
    private final UserRepository userRepository;

    @Transactional
    public BottleResponseDTO addBottle(Long userId, Long wineId) {
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
                .bottle_id(savedBottle.getId())
                .created_at(savedBottle.getCreateAt())
                .wine(
                        BottleResponseDTO.WineSimpleDTO.builder()
                                .wine_id(wine.getId())
                                .name(wine.getKrName())
                                .type(typeName)
                                .country(wine.getCountry())
                                .grape(wine.getGrape())
                                .build()
                )
                .build();
    }
}