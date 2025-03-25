//package com.ssafy.winedining.domain.collection.controller;
//
//import com.ssafy.winedining.domain.collection.dto.BottleResponseDTO;
//import com.ssafy.winedining.domain.collection.dto.CellarResponseDTO;
//import com.ssafy.winedining.domain.collection.service.CellarService;
//import com.ssafy.winedining.global.auth.dto.CustomOAuth2User;
//import com.ssafy.winedining.global.common.ApiResponse;
//import lombok.RequiredArgsConstructor;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import org.springframework.security.core.AuthenticationException;
//import org.springframework.security.core.annotation.AuthenticationPrincipal;
//import org.springframework.web.bind.annotation.*;
//
//@RestController
//@RequestMapping("/api/v1/collection/cellar")
//@RequiredArgsConstructor
//public class CellarController {
//
//    private final CellarService cellarService;
//
//    /**
//     * 사용자의 와인 셀러 정보를 조회합니다.
//     */
//    @GetMapping
//    public ResponseEntity<ApiResponse<CellarResponseDTO>> getUserCellar(@AuthenticationPrincipal CustomOAuth2User customOAuth2User) {
//        // 인증되지 않은 사용자 처리
//        if (customOAuth2User == null) {
//            throw new AuthenticationException("인증이 필요합니다.") {};
//        }
//
//        Long userId = customOAuth2User.getUserId();
//        if (userId == null) {
//            throw new IllegalArgumentException("유효하지 않은 사용자 ID입니다.");
//        }
//
//        CellarResponseDTO cellarResponseDTO = cellarService.getUserCellar(userId);
//
//        ApiResponse<CellarResponseDTO> response = ApiResponse.<CellarResponseDTO>builder()
//                .status(HttpStatus.OK.value())
//                .success(true)
//                .message("와인 셀러 조회 성공")
//                .data(cellarResponseDTO)
//                .build();
//
//        return ResponseEntity.ok(response);
//    }
//
//    /**
//     * 새로운 와인을 셀러에 추가합니다.
//     */
//    @PostMapping("/{wineId}")
//    public ResponseEntity<ApiResponse<BottleResponseDTO>> addBottle(
//            @AuthenticationPrincipal CustomOAuth2User customOAuth2User,
//            @PathVariable Long wineId) {
//
//        // 인증되지 않은 사용자 처리
//        if (customOAuth2User == null) {
//            throw new AuthenticationException("인증이 필요합니다.") {};
//        }
//
//        Long userId = customOAuth2User.getUserId();
//        if (userId == null) {
//            throw new IllegalArgumentException("유효하지 않은 사용자 ID입니다.");
//        }
//
//        BottleResponseDTO bottleResponseDTO = cellarService.addBottle(userId, wineId);
//
//        ApiResponse<BottleResponseDTO> response = ApiResponse.<BottleResponseDTO>builder()
//                .status(HttpStatus.CREATED.value())
//                .success(true)
//                .message("와인 등록 성공")
//                .data(bottleResponseDTO)
//                .build();
//
//        return ResponseEntity.status(HttpStatus.CREATED).body(response);
//    }
//
////    /**
////     * 베스트 와인 목록을 조회합니다.
////     */
////    @GetMapping("/best")
////    public ResponseEntity<ApiResponse<CellarResponseDTO>> getBestWines(@AuthenticationPrincipal CustomOAuth2User customOAuth2User) {
////        // 인증되지 않은 사용자 처리
////        if (customOAuth2User == null) {
////            throw new AuthenticationException("인증이 필요합니다.") {};
////        }
////
////        Long userId = customOAuth2User.getUserId();
////        if (userId == null) {
////            throw new IllegalArgumentException("유효하지 않은 사용자 ID입니다.");
////        }
////
////        CellarResponseDTO bestWines = cellarService.getBestWines(userId);
////
////        ApiResponse<CellarResponseDTO> response = ApiResponse.<CellarResponseDTO>builder()
////                .status(HttpStatus.OK.value())
////                .success(true)
////                .message("베스트 와인 조회 성공")
////                .data(bestWines)
////                .build();
////
////        return ResponseEntity.ok(response);
////    }
////
////    /**
////     * 와인을 베스트로 설정합니다.
////     */
////    @PatchMapping("/{bottleId}/best")
////    public ResponseEntity<ApiResponse<BottleResponseDTO>> toggleBestWine(
////            @AuthenticationPrincipal CustomOAuth2User customOAuth2User,
////            @PathVariable Long bottleId,
////            @RequestParam(required = false, defaultValue = "true") boolean isBest) {
////
////        // 인증되지 않은 사용자 처리
////        if (customOAuth2User == null) {
////            throw new AuthenticationException("인증이 필요합니다.") {};
////        }
////
////        Long userId = customOAuth2User.getUserId();
////        if (userId == null) {
////            throw new IllegalArgumentException("유효하지 않은 사용자 ID입니다.");
////        }
////
////        BottleResponseDTO updatedBottle = cellarService.toggleBestWine(userId, bottleId, isBest);
////
////        String message = isBest ? "베스트 와인 등록 성공" : "베스트 와인 해제 성공";
////
////        ApiResponse<BottleResponseDTO> response = ApiResponse.<BottleResponseDTO>builder()
////                .status(HttpStatus.OK.value())
////                .success(true)
////                .message(message)
////                .data(updatedBottle)
////                .build();
////
////        return ResponseEntity.ok(response);
////    }
////
////    /**
////     * 와인 병을 삭제합니다.
////     */
////    @DeleteMapping("/{bottleId}")
////    public ResponseEntity<ApiResponse<Void>> deleteBottle(
////            @AuthenticationPrincipal CustomOAuth2User customOAuth2User,
////            @PathVariable Long bottleId) {
////
////        // 인증되지 않은 사용자 처리
////        if (customOAuth2User == null) {
////            throw new AuthenticationException("인증이 필요합니다.") {};
////        }
////
////        Long userId = customOAuth2User.getUserId();
////        if (userId == null) {
////            throw new IllegalArgumentException("유효하지 않은 사용자 ID입니다.");
////        }
////
////        cellarService.deleteBottle(userId, bottleId);
////
////        ApiResponse<Void> response = ApiResponse.<Void>builder()
////                .status(HttpStatus.OK.value())
////                .success(true)
////                .message("와인 삭제 성공")
////                .data(null)
////                .build();
////
////        return ResponseEntity.ok(response);
////    }
//}