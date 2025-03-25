//package com.ssafy.winedining.domain.collection.service;
//
//import com.ssafy.winedining.domain.collection.dto.BottleResponseDTO;
//import com.ssafy.winedining.domain.collection.dto.CellarResponseDTO;
//import com.ssafy.winedining.domain.collection.entity.Bottle;
//import com.ssafy.winedining.domain.collection.repository.BottleRepository;
//import com.ssafy.winedining.domain.user.entity.User;
//import com.ssafy.winedining.domain.user.repository.UserRepository;
//import com.ssafy.winedining.domain.wine.entity.CustomWine;
//import com.ssafy.winedining.domain.wine.entity.Wine;
//import com.ssafy.winedining.domain.wine.entity.WineType;
//import com.ssafy.winedining.domain.wine.repository.WineRepository;
//import lombok.RequiredArgsConstructor;
//import org.springframework.stereotype.Service;
//import org.springframework.transaction.annotation.Transactional;
//
//import java.time.LocalDateTime;
//import java.util.List;
//import java.util.NoSuchElementException;
//import java.util.stream.Collectors;
//
//@Service
//@RequiredArgsConstructor
//public class CellarService {
//
//    private final BottleRepository bottleRepository;
//    private final WineRepository wineRepository;
//    private final UserRepository userRepository;
//
//    /**
//     * 사용자의 와인 셀러 정보를 조회합니다.
//     */
//    @Transactional(readOnly = true)
//    public CellarResponseDTO getUserCellar(Long userId) {
//        // 사용자 확인
//        User user = userRepository.findById(userId)
//                .orElseThrow(() -> new NoSuchElementException("존재하지 않는 사용자입니다."));
//
//        // 사용자의 와인 병 목록 조회
//        List<Bottle> bottles = bottleRepository.findByUserId(userId);
//
//        // DTO 변환
//        List<BottleResponseDTO> bottleDTOs = bottles.stream()
//                .map(this::convertToBottleDTO)
//                .collect(Collectors.toList());
//
//        return CellarResponseDTO.builder()
//                .bottles(bottleDTOs)
//                .total_count(bottleDTOs.size())
//                .build();
//    }
//
//    /**
//     * 새로운 와인을 셀러에 추가합니다.
//     */
//    @Transactional
//    public BottleResponseDTO addBottle(Long userId, Long wineId) {
//        // 사용자 확인
//        User user = userRepository.findById(userId)
//                .orElseThrow(() -> new NoSuchElementException("존재하지 않는 사용자입니다."));
//
//        // 와인 확인
//        Wine wine = wineRepository.findById(wineId)
//                .orElseThrow(() -> new NoSuchElementException("존재하지 않는 와인입니다."));
//
//        // 새로운 병 생성 및 저장
//        Bottle bottle = Bottle.builder()
//                .createAt(LocalDateTime.now().toString())
//                .best(false)
//                .user(user)
//                .wine(wine)
//                .customWine(null)
//                .build();
//
//        Bottle savedBottle = bottleRepository.save(bottle);
//
//        // DTO 변환 후 반환
//        return convertToBottleDTO(savedBottle);
//    }
//
////    /**
////     * 베스트 와인을 조회합니다.
////     */
////    @Transactional(readOnly = true)
////    public CellarResponseDTO getBestWines(Long userId) {
////        // 사용자 확인
////        User user = userRepository.findById(userId)
////                .orElseThrow(() -> new NoSuchElementException("존재하지 않는 사용자입니다."));
////
////        // 베스트 와인 목록 조회
////        List<Bottle> bestBottles = bottleRepository.findByUserIdAndBestIsTrue(userId);
////
////        // DTO 변환
////        List<BottleResponseDTO> bottleDTOs = bestBottles.stream()
////                .map(this::convertToBottleDTO)
////                .collect(Collectors.toList());
////
////        return CellarResponseDTO.builder()
////                .bottles(bottleDTOs)
////                .total_count(bottleDTOs.size())
////                .build();
////    }
////
////    /**
////     * 와인을 베스트로 설정하거나 해제합니다.
////     */
////    @Transactional
////    public BottleResponseDTO toggleBestWine(Long userId, Long bottleId, boolean isBest) {
////        // 병 정보 조회 및 사용자 검증
////        Bottle bottle = bottleRepository.findById(bottleId)
////                .orElseThrow(() -> new NoSuchElementException("존재하지 않는 와인 병입니다."));
////
////        if (!bottle.getUser().getId().equals(userId)) {
////            throw new IllegalArgumentException("해당 와인에 대한 권한이 없습니다.");
////        }
////
////        // 베스트 상태 변경
////        bottle.setBest(isBest);
////        Bottle updatedBottle = bottleRepository.save(bottle);
////
////        return convertToBottleDTO(updatedBottle);
////    }
////
////    /**
////     * 와인 병을 삭제합니다.
////     */
////    @Transactional
////    public void deleteBottle(Long userId, Long bottleId) {
////        // 병 정보 조회 및 사용자 검증
////        Bottle bottle = bottleRepository.findById(bottleId)
////                .orElseThrow(() -> new NoSuchElementException("존재하지 않는 와인 병입니다."));
////
////        if (!bottle.getUser().getId().equals(userId)) {
////            throw new IllegalArgumentException("해당 와인에 대한 권한이 없습니다.");
////        }
////
////        bottleRepository.delete(bottle);
////    }
//
//    /**
//     * Bottle 엔티티를 BottleResponseDTO로 변환합니다.
//     */
//    private BottleResponseDTO convertToBottleDTO(Bottle bottle) {
//        BottleResponseDTO.BottleResponseDTOBuilder builder = BottleResponseDTO.builder()
//                .bottle_id(bottle.getId())
//                .created_at(bottle.getCreateAt())
//                .is_best(bottle.isBest())
//                .is_custom(bottle.getCustomWine() != null);
//
//        if (bottle.getWine() != null) {
//            Wine wine = bottle.getWine();
//            WineType wineType = wine.getWineType();
//
//            builder.wine(BottleResponseDTO.WineSimpleDTO.builder()
//                    .wine_id(wine.getId())
//                    .image(wine.getImage())
//                    .name(wine.getKrName()) // 한글 이름 사용
//                    .type(wineType != null ? wineType.getTypeName() : "알 수 없음")
//                    .country(wine.getCountry())
//                    .grape(wine.getGrape())
//                    .build());
//        }
//
//        if (bottle.getCustomWine() != null) {
//            CustomWine customWine = bottle.getCustomWine();
//
//            builder.custom_wine(BottleResponseDTO.CustomWineSimpleDTO.builder()
//                    .wine_id(customWine.getId())
//                    .image("https://winedining-images.s3.ap-northeast-2.amazonaws.com/default-wine.png") // 기본 이미지
//                    .name(customWine.getName())
//                    .type(customWine.getType() != null ? customWine.getType().getTypeName() : "알 수 없음")
//                    .country(customWine.getCountry())
//                    .grape("") // 커스텀 와인에 포도 정보가 없는 경우 빈 문자열
//                    .build());
//        }
//
//        return builder.build();
//    }
//}