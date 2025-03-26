package com.ssafy.winedining.domain.collection.service;

import com.ssafy.winedining.domain.collection.dto.WineDTO;
import com.ssafy.winedining.domain.collection.dto.WishListResponseDTO;
import com.ssafy.winedining.domain.collection.dto.WishResponseDTO;
import com.ssafy.winedining.domain.collection.entity.WishItem;
import com.ssafy.winedining.domain.collection.repository.WishItemRepository;
import com.ssafy.winedining.domain.user.entity.User;
import com.ssafy.winedining.domain.user.repository.UserRepository;
import com.ssafy.winedining.domain.wine.entity.Wine;
import com.ssafy.winedining.domain.wine.repository.WineRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WishService {

    private final WishItemRepository wishItemRepository;
    private final UserRepository userRepository;
    private final WineRepository wineRepository;

    /**
     * 와인 위시리스트 조회
     */
    public WishListResponseDTO getWishList(Long userId) {
        // 사용자 확인
        userRepository.findById(userId)
                .orElseThrow(() -> new NoSuchElementException("존재하지 않는 사용자입니다."));

        // 사용자의 위시리스트 조회
        List<WishItem> wishItems = wishItemRepository.findByUserId(userId);

        // DTO 변환
        List<WishResponseDTO> wishDTOs = wishItems.stream()
                .map(item -> {
                    Wine wine = item.getWine();
                    return WishResponseDTO.builder()
                            .id(item.getId())
                            .createdAt(item.getCreatedAt())
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
                })
                .collect(Collectors.toList());

        // 응답 구성
        return WishListResponseDTO.builder()
                .wishes(wishDTOs)
                .totalCount(wishDTOs.size())
                .build();
    }

    /**
     * 와인 위시리스트 추가
     */
    @Transactional
    public WishResponseDTO addToWishList(Long userId, Long wineId) {
        // 사용자 확인
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NoSuchElementException("존재하지 않는 사용자입니다."));

        // 와인 확인
        Wine wine = wineRepository.findById(wineId)
                .orElseThrow(() -> new NoSuchElementException("존재하지 않는 와인입니다."));

        // 이미 위시리스트에 있는지 확인
        if (wishItemRepository.existsByUserIdAndWineId(userId, wineId)) {
            throw new IllegalStateException("이미 위시리스트에 추가된 와인입니다.");
        }

        // 위시 아이템 생성 및 저장
        WishItem wishItem = WishItem.builder()
                .createdAt(LocalDateTime.now().toString())
                .user(user)
                .wine(wine)
                .build();

        WishItem savedItem = wishItemRepository.save(wishItem);

        // 응답 구성
        return WishResponseDTO.builder()
                .id(savedItem.getId())
                .createdAt(savedItem.getCreatedAt())
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
    }

    /**
     * 와인 위시리스트 제거
     */
    @Transactional
    public void removeFromWishList(Long userId, Long wineId) {
        // 사용자 확인
        userRepository.findById(userId)
                .orElseThrow(() -> new NoSuchElementException("존재하지 않는 사용자입니다."));

        // 위시 아이템 확인
        WishItem wishItem = wishItemRepository.findByUserIdAndWineId(userId, wineId)
                .orElseThrow(() -> new NoSuchElementException("위시리스트에 해당 와인이 없습니다."));

        // 위시 아이템 삭제
        wishItemRepository.delete(wishItem);
    }
}