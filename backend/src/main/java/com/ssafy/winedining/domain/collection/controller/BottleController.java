package com.ssafy.winedining.domain.collection.controller;

import com.ssafy.winedining.domain.collection.dto.BottleResponseDTO;
import com.ssafy.winedining.domain.collection.service.BottleService;
import com.ssafy.winedining.global.common.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/collection/cellar")
@RequiredArgsConstructor
public class BottleController {

    private final BottleService bottleService;

    @PostMapping("/{wineId}")
    public ResponseEntity<ApiResponse<BottleResponseDTO>> addBottle(@PathVariable Long wineId) {
        // 실제 구현에서는 토큰에서 사용자 ID를 추출하겠지만, 현재는 1L로 고정
        Long userId = 1L;

        BottleResponseDTO bottleResponseDTO = bottleService.addBottle(userId, wineId);

        ApiResponse<BottleResponseDTO> response = ApiResponse.<BottleResponseDTO>builder()
                .status(HttpStatus.CREATED.value())
                .success(true)
                .message("와인 등록 성공")
                .data(bottleResponseDTO)
                .build();

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}