package com.ssafy.winedining.domain.wine.service;

import com.ssafy.winedining.domain.collection.repository.WishItemRepository;
import com.ssafy.winedining.domain.food.entity.Food;
import com.ssafy.winedining.domain.food.repository.PairingSetRepository;
import com.ssafy.winedining.domain.wine.dto.*;
import com.ssafy.winedining.domain.wine.entity.Wine;
import com.ssafy.winedining.domain.wine.repository.WineRepository;
import com.ssafy.winedining.domain.wine.repository.WineSpecification;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WineService {

    private final WineRepository wineRepository;
    private final PairingSetRepository pairingSetRepository;
    private final WishItemRepository wishItemRepository;

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
                .wineId(wine.getId())
                .krName(wine.getKrName())
                .enName(wine.getEnName())
                .image(wine.getImage())
                .type(typeName)
                .country(wine.getCountry())
                .grape(wine.getGrape())
                .price(wine.getPrice())
                .sweetness(wine.getSweetness())
                .acidity(wine.getAcidity())
                .tannin(wine.getTannin())
                .body(wine.getBody())
                .alcoholContent(wine.getAlcoholContent())
                .pairing(pairingFoodNames)
                .build();
    }

    @Transactional(readOnly = true)
    public WineListResponseDTO getWineListByFilter(
            WineListRequestDTO request, Long userId) {

        // 초기 명세 설정
        Specification<Wine> spec = Specification.where(null);

        // 키워드 필터 적용
        if (request.getKeyword() != null && !request.getKeyword().isEmpty()) {
            spec = spec.and(WineSpecification.keywordContains(request.getKeyword()));
        }

        // 필터가 null이 아닌 경우에만 처리
        if (request.getFilters() != null) {
            WineListRequestFilterDTO filters = request.getFilters();

            // 가격 범위 필터 적용
            spec = spec.and(WineSpecification.priceBetween(filters.getMinPrice(), filters.getMaxPrice()));

            // 와인 타입 필터 적용
            if (filters.getType() != null && !filters.getType().isEmpty()) {
                spec = spec.and(WineSpecification.typeIn(filters.getType()));
            }

            // 포도 품종 필터 적용
            if (filters.getGrape() != null && !filters.getGrape().isEmpty()) {
                spec = spec.and(WineSpecification.grapeContains(filters.getGrape()));
            }

            // 국가 필터 적용
            if (filters.getCountry() != null && !filters.getCountry().isEmpty()) {
                spec = spec.and(WineSpecification.countryIn(filters.getCountry()));
            }

            // 당도 범위 필터 적용
            spec = spec.and(WineSpecification.sweetnessBetween(filters.getMinSweetness(), filters.getMaxSweetness()));

            // 산미 범위 필터 적용
            spec = spec.and(WineSpecification.acidityBetween(filters.getMinAcidity(), filters.getMaxAcidity()));

            // 타닌 범위 필터 적용 (레드 와인에만 해당)
            spec = spec.and(WineSpecification.tanninBetween(filters.getMinTannin(), filters.getMaxTannin()));

            // 바디감 범위 필터 적용
            spec = spec.and(WineSpecification.bodyBetween(filters.getMinBody(), filters.getMaxBody()));

            // 페어링 음식 필터 적용 (ID 기반)
            if (filters.getPairing() != null && !filters.getPairing().isEmpty()) {
                spec = spec.and(WineSpecification.hasPairing(filters.getPairing()));
            }
        }

        // 페이징, 정렬 처리
        int page = request.getPage() != null ? request.getPage() - 1 : 0;
        int limit = request.getLimit() != null ? request.getLimit() : 20;

        // 정렬 처리
        Sort sort = Sort.unsorted();
        if (request.getSort() != null && request.getSort().getField() != null && request.getSort().getOrder() != null) {
            try {
                Sort.Direction direction = Sort.Direction.fromString(request.getSort().getOrder());
                sort = Sort.by(direction, request.getSort().getField());
            } catch (IllegalArgumentException e) {
                // 잘못된 정렬 방향이 주어진 경우 기본 정렬 사용
                sort = Sort.by(Sort.Direction.ASC, "id");
            }
        }

        Pageable pageable = PageRequest.of(page, limit, sort);

        // 실제 DB 조회
        Page<Wine> winePage = wineRepository.findAll(spec, pageable);

        // userId가 null이 아닌 경우에만 위시 아이템 조회
        final Set<Long> wishWineIds = new HashSet<>();
        if (userId != null) {
            // 해당 사용자의 모든 위시 와인 ID를 한 번에 조회
            wishWineIds.addAll(wishItemRepository.findWineIdsByUserId(userId));
        }

        // DTO 변환
        List<WineListItemDTO> wineList = winePage.getContent().stream()
                .map(wine -> {
                    WineListItemDTO dto = new WineListItemDTO();
                    dto.setWineId(wine.getId());
                    dto.setName(wine.getKrName());
                    dto.setImage(wine.getImage());
                    dto.setType(wine.getWineType().getTypeName());
                    dto.setCountry(wine.getCountry());
                    dto.setGrape(wine.getGrape());

                    // 사용자가 로그인한 경우에만 위시리스트 체크
//                    boolean isWish = false;
//                    if (userId != null) {
//                        isWish = wishItemRepository.existsByUserIdAndWineId(userId, wine.getId());
//                    }
//                    dto.setWish(isWish);
                    dto.setWish(wishWineIds.contains(wine.getId()));
                    return dto;
                })
                .collect(Collectors.toList());

        WineListResponseDTO response = new WineListResponseDTO();
        response.setWines(wineList);
        response.setTotalCount((int) winePage.getTotalElements());
        response.setPage(winePage.getNumber() + 1);
        response.setTotalPages(winePage.getTotalPages());
        response.setLimit(limit);

        return response;
    }

}