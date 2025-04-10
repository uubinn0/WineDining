package com.ssafy.winedining.domain.info.controller;

import com.ssafy.winedining.domain.info.dto.InfoDetailResponseDTO;
import com.ssafy.winedining.domain.info.dto.InfoListResponseDTO;
import com.ssafy.winedining.domain.info.service.InfoService;
import com.ssafy.winedining.global.common.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/info/wine")
@RequiredArgsConstructor
public class InfoController {

    private final InfoService infoService;

    /**
     * 알쓸신잡 리스트 조회 API
     */
    @GetMapping
    public ResponseEntity<ApiResponse<InfoListResponseDTO>> getWineInfoList(
            @RequestParam(required = false, defaultValue = "1") int page,
            @RequestParam(required = false, defaultValue = "6") int limit) {

        InfoListResponseDTO responseDTO = infoService.getWineInfoList(page, limit);

        ApiResponse<InfoListResponseDTO> response = ApiResponse.<InfoListResponseDTO>builder()
                .status(HttpStatus.OK.value())
                .success(true)
                .message("와인 상식 조회 성공")
                .data(responseDTO)
                .build();

        return ResponseEntity.ok(response);
    }

    /**
     * 알쓸신잡 상세 조회 API
     */
    @GetMapping("/{infoId}")
    public ResponseEntity<ApiResponse<InfoDetailResponseDTO>> getWineInfoDetail(
            @PathVariable Long infoId) {

        InfoDetailResponseDTO responseDTO = infoService.getWineInfoDetail(infoId);

        ApiResponse<InfoDetailResponseDTO> response = ApiResponse.<InfoDetailResponseDTO>builder()
                .status(HttpStatus.OK.value())
                .success(true)
                .message("와인 상식 상세 조회 성공")
                .data(responseDTO)
                .build();

        return ResponseEntity.ok(response);
    }
}