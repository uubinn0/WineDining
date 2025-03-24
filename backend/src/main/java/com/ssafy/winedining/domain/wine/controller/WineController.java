package com.ssafy.winedining.domain.wine.controller;

import com.ssafy.winedining.domain.wine.dto.WineResponseDTO;
import com.ssafy.winedining.domain.wine.service.WineService;
import com.ssafy.winedining.global.common.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}