package com.ssafy.winedining.domain.collection.controller;

import com.ssafy.winedining.domain.collection.dto.*;
import com.ssafy.winedining.domain.collection.service.CellarService;
import com.ssafy.winedining.global.auth.dto.CustomOAuth2User;
import com.ssafy.winedining.global.common.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/collection/cellar")
@RequiredArgsConstructor
public class CellarController {

    private final CellarService cellarService;

    /**
     * 기존 와인을 셀러에 추가하는 API
     */
    @PostMapping("/{wineId}")
    public ResponseEntity<ApiResponse<BottleResponseDTO>> addWineToBottle(
            @AuthenticationPrincipal CustomOAuth2User customOAuth2User,
            @PathVariable Long wineId) {

        Long userId = customOAuth2User.getUserId();
        BottleResponseDTO bottleResponseDTO = cellarService.addWineToBottle(userId, wineId);

        ApiResponse<BottleResponseDTO> response = ApiResponse.<BottleResponseDTO>builder()
                .status(HttpStatus.CREATED.value())
                .success(true)
                .message("와인을 셀러에 추가했습니다")
                .data(bottleResponseDTO)
                .build();

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * 커스텀 와인을 생성하고 바로 셀러에 추가하는 API
     */
    @PostMapping("/custom")
    public ResponseEntity<ApiResponse<CustomBottleResponseDTO>> createCustomWineAndAddToBottle(
            @AuthenticationPrincipal CustomOAuth2User customOAuth2User,
            @RequestBody CustomWineCreateDTO customWineDTO) {

        Long userId = customOAuth2User.getUserId();
        CustomBottleResponseDTO responseDTO = cellarService.createCustomWineAndAddToBottle(userId, customWineDTO);

        ApiResponse<CustomBottleResponseDTO> response = ApiResponse.<CustomBottleResponseDTO>builder()
                .status(HttpStatus.CREATED.value())
                .success(true)
                .message("커스텀 와인을 생성하고 셀러에 추가했습니다")
                .data(responseDTO)
                .build();

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * 사용자의 모든 병(일반 와인 + 커스텀 와인) 조회 API
     */
    @GetMapping
    public ResponseEntity<ApiResponse<CellarResponseDTO>> getUserBottles(
            @AuthenticationPrincipal CustomOAuth2User customOAuth2User) {

        Long userId = customOAuth2User.getUserId();
        CellarResponseDTO cellarResponseDTO = cellarService.getUserBottles(userId);

        ApiResponse<CellarResponseDTO> response = ApiResponse.<CellarResponseDTO>builder()
                .status(HttpStatus.OK.value())
                .success(true)
                .message("사용자의 셀러를 조회했습니다")
                .data(cellarResponseDTO)
                .build();

        return ResponseEntity.ok(response);
    }

    /**
     * 베스트 와인 조회 API
     */
    @GetMapping("/best")
    public ResponseEntity<ApiResponse<CellarResponseDTO>> getBestWines(
            @AuthenticationPrincipal CustomOAuth2User customOAuth2User) {

        Long userId = customOAuth2User.getUserId();
        CellarResponseDTO responseDTO = cellarService.getBestWines(userId);

        ApiResponse<CellarResponseDTO> response = ApiResponse.<CellarResponseDTO>builder()
                .status(HttpStatus.OK.value())
                .success(true)
                .message("베스트 와인 조회 성공")
                .data(responseDTO)
                .build();

        return ResponseEntity.ok(response);
    }

    /**
     * 베스트 와인 등록/해제 API
     */
    @PatchMapping("/{bottleId}/best")
    public ResponseEntity<ApiResponse<Void>> updateBestWineStatus(
            @AuthenticationPrincipal CustomOAuth2User customOAuth2User,
            @PathVariable Long bottleId,
            @RequestBody BestWineRequestDTO requestDTO) {

        Long userId = customOAuth2User.getUserId();
        boolean setBest = requestDTO.isBest();

        cellarService.updateBestWineStatus(userId, bottleId, setBest);

        String message = setBest ? "베스트 와인 등록 성공" : "베스트 와인 해제 성공";

        ApiResponse<Void> response = ApiResponse.<Void>builder()
                .status(HttpStatus.OK.value())
                .success(true)
                .message(message)
                .data(null)
                .build();

        return ResponseEntity.ok(response);
    }
}