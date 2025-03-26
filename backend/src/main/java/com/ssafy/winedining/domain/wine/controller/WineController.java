package com.ssafy.winedining.domain.wine.controller;

import com.ssafy.winedining.domain.wine.dto.WineListRequestDTO;
import com.ssafy.winedining.domain.wine.dto.WineListResponseDTO;
import com.ssafy.winedining.domain.wine.dto.WineResponseDTO;
import com.ssafy.winedining.domain.wine.service.WineService;
import com.ssafy.winedining.global.auth.dto.CustomOAuth2User;
import com.ssafy.winedining.global.common.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/product")
@RequiredArgsConstructor
public class WineController {

    private final WineService wineService;

    @GetMapping("/{wineId}")
    public ResponseEntity<ApiResponse<WineResponseDTO>> getWineDetail(@PathVariable Long wineId) {
        WineResponseDTO wineResponseDTO = wineService.getWineDetail(wineId);

        ApiResponse<WineResponseDTO> response = ApiResponse.<WineResponseDTO>builder()
                .status(HttpStatus.OK.value())
                .success(true)
                .message("와인 상세페이지 조회")
                .data(wineResponseDTO)
                .build();

        return ResponseEntity.ok(response);
    }

    @PostMapping("/")
    public ResponseEntity<ApiResponse<WineListResponseDTO>> searchWineList(
            @AuthenticationPrincipal CustomOAuth2User customOAuth2User,
            @RequestBody WineListRequestDTO request){

        WineListResponseDTO wineListResponseDTO = wineService.getWineListByFilter(request);
        ApiResponse<WineListResponseDTO> response = ApiResponse.<WineListResponseDTO>builder()
                .status(HttpStatus.OK.value())
                .success(true)
                .message("와인 목록 조회")
                .data(wineListResponseDTO)
                .build();

        return ResponseEntity.ok(response);
    }
}