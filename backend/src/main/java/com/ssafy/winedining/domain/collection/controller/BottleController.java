package com.ssafy.winedining.domain.collection.controller;

import com.ssafy.winedining.domain.collection.dto.BottleResponseDTO;
import com.ssafy.winedining.domain.collection.dto.CellarResponseDTO;
import com.ssafy.winedining.domain.collection.service.BottleService;
import com.ssafy.winedining.global.auth.dto.CustomOAuth2User;
import com.ssafy.winedining.global.common.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/collection/cellar")
@RequiredArgsConstructor
public class BottleController {

    private final BottleService bottleService;

    @PostMapping("/{wineId}")
    public ResponseEntity<ApiResponse<BottleResponseDTO>> addBottle(@AuthenticationPrincipal CustomOAuth2User customOAuth2User, @PathVariable Long wineId) {

        Long userId = customOAuth2User.getUserId();

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