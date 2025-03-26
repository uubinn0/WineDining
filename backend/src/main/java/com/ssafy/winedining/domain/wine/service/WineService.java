package com.ssafy.winedining.domain.wine.service;

import com.ssafy.winedining.domain.collection.repository.WishItemRepository;
import com.ssafy.winedining.domain.food.entity.Food;
import com.ssafy.winedining.domain.food.repository.PairingSetRepository;
import com.ssafy.winedining.domain.wine.dto.WineListItemDTO;
import com.ssafy.winedining.domain.wine.dto.WineListRequestDTO;
import com.ssafy.winedining.domain.wine.dto.WineListResponseDTO;
import com.ssafy.winedining.domain.wine.dto.WineResponseDTO;
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

import java.util.List;
import java.util.NoSuchElementException;
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

        // 동적 조건 생성
        Specification<Wine> spec = Specification.where(WineSpecification.keywordContains(request.getKeyword()))
                .and(WineSpecification.priceBetween(request.getFilters().getMinPrice(), request.getFilters().getMaxPrice()));
        // 추가 필터 조건들을 and()로 연결할 수 있습니다.

        // 페이징, 정렬 처리 (예: PageRequest.of(page, limit, sort))
        int page = request.getPage() != null ? request.getPage() - 1 : 0;
        int limit = request.getLimit() != null ? request.getLimit() : 20;
        Sort sort = Sort.unsorted();
        if (request.getSort() != null) {
            sort = Sort.by(Sort.Direction.fromString(request.getSort().getOrder()), request.getSort().getField());
        }
        Pageable pageable = PageRequest.of(page, limit, sort);

        // 실제 DB 조회 (Page<Wine> 형태)
        Page<Wine> winePage = wineRepository.findAll(spec, pageable);

        // DTO 변환
        List<WineListItemDTO> wineList = winePage.getContent().stream()
                .map(wine -> {
                    WineListItemDTO dto = new WineListItemDTO();
                    dto.setWineId(wine.getId());
                    dto.setName(wine.getKrName());
                    dto.setTypeName(wine.getWineType().getTypeName());
                    dto.setCountry(wine.getCountry());
                    dto.setGrape(wine.getGrape());
                    // isWish 관련 정보는 로그인한 사용자 정보 등과 연동 필요 (여기서는 false로 처리)
                    boolean isWish = wishItemRepository.existsByUserIdAndWineId(userId, wine.getId());
                    System.out.println("isWish = " + isWish);
                    dto.setWish(isWish);
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