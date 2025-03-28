package com.ssafy.winedining.domain.collection.controller;

import com.ssafy.winedining.domain.collection.dto.WishListResponseDTO;
import com.ssafy.winedining.domain.collection.dto.WishResponseDTO;
import com.ssafy.winedining.domain.collection.service.WishService;
import com.ssafy.winedining.global.auth.dto.CustomOAuth2User;
import com.ssafy.winedining.global.common.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/collection/wish")
@RequiredArgsConstructor
public class WishController {

    private final WishService wishService;

    /**
     * 와인 위시리스트 조회 API
     */
    @GetMapping
    public ResponseEntity<ApiResponse<WishListResponseDTO>> getWishList(
            @AuthenticationPrincipal CustomOAuth2User customOAuth2User) {

        Long userId = customOAuth2User.getUserId();
        WishListResponseDTO responseDTO = wishService.getWishList(userId);

        ApiResponse<WishListResponseDTO> response = ApiResponse.<WishListResponseDTO>builder()
                .status(HttpStatus.OK.value())
                .success(true)
                .message("찜 목록 조회 성공")
                .data(responseDTO)
                .build();

        return ResponseEntity.ok(response);
    }

    /**
     * 와인 위시리스트 추가 API
     */
    @PostMapping("/{wineId}")
    public ResponseEntity<ApiResponse<WishResponseDTO>> addToWishList(
            @AuthenticationPrincipal CustomOAuth2User customOAuth2User,
            @PathVariable Long wineId) {

        Long userId = customOAuth2User.getUserId();
        WishResponseDTO responseDTO = wishService.addToWishList(userId, wineId);

        ApiResponse<WishResponseDTO> response = ApiResponse.<WishResponseDTO>builder()
                .status(HttpStatus.OK.value())
                .success(true)
                .message("와인 위시리스트에 추가 성공")
                .data(responseDTO)
                .build();

        return ResponseEntity.ok(response);
    }

    /**
     * 와인 위시리스트 제거 API
     */
    @DeleteMapping("/{wineId}")
    public ResponseEntity<ApiResponse<Void>> removeFromWishList(
            @AuthenticationPrincipal CustomOAuth2User customOAuth2User,
            @PathVariable Long wineId) {

        Long userId = customOAuth2User.getUserId();
        wishService.removeFromWishList(userId, wineId);

        ApiResponse<Void> response = ApiResponse.<Void>builder()
                .status(HttpStatus.OK.value())
                .success(true)
                .message("위시리스트 제거 성공")
                .data(null)
                .build();

        return ResponseEntity.ok(response);
    }
}