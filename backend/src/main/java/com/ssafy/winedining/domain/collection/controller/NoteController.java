package com.ssafy.winedining.domain.collection.controller;

import com.ssafy.winedining.domain.collection.dto.BottleNotesResponseDTO;
import com.ssafy.winedining.domain.collection.dto.NoteRequestDTO;
import com.ssafy.winedining.domain.collection.dto.NoteResponseDTO;
import com.ssafy.winedining.domain.collection.service.NoteService;
import com.ssafy.winedining.global.auth.dto.CustomOAuth2User;
import com.ssafy.winedining.global.common.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/collection/note")
@RequiredArgsConstructor
public class NoteController {

    private final NoteService noteService;

    /**
     * 와인별 노트 기록 전체 조회 API
     */
    @GetMapping("/{bottleId}")
    public ResponseEntity<ApiResponse<BottleNotesResponseDTO>> getBottleNotes(
            @AuthenticationPrincipal CustomOAuth2User customOAuth2User,
            @PathVariable Long bottleId) {

        Long userId = customOAuth2User.getUserId();
        BottleNotesResponseDTO responseDTO = noteService.getBottleNotes(userId, bottleId);

        ApiResponse<BottleNotesResponseDTO> response = ApiResponse.<BottleNotesResponseDTO>builder()
                .status(HttpStatus.OK.value())
                .success(true)
                .message("와인 노트 조회 성공")
                .data(responseDTO)
                .build();

        return ResponseEntity.ok(response);
    }

    /**
     * 노트 기록 저장 API
     */
    @PostMapping("/{bottleId}")
    public ResponseEntity<ApiResponse<NoteResponseDTO>> createNote(
            @AuthenticationPrincipal CustomOAuth2User customOAuth2User,
            @PathVariable Long bottleId,
            @RequestBody NoteRequestDTO requestDTO) {

        Long userId = customOAuth2User.getUserId();
        NoteResponseDTO responseDTO = noteService.createNote(userId, bottleId, requestDTO);

        ApiResponse<NoteResponseDTO> response = ApiResponse.<NoteResponseDTO>builder()
                .status(HttpStatus.OK.value())
                .success(true)
                .message("와인 노트 저장 성공")
                .data(responseDTO)
                .build();

        return ResponseEntity.ok(response);
    }

    /**
     * 노트 기록 수정 API
     */
    @PutMapping("/{noteId}")
    public ResponseEntity<ApiResponse<NoteResponseDTO>> updateNote(
            @AuthenticationPrincipal CustomOAuth2User customOAuth2User,
            @PathVariable Long noteId,
            @RequestBody NoteRequestDTO requestDTO) {

        Long userId = customOAuth2User.getUserId();
        NoteResponseDTO responseDTO = noteService.updateNote(userId, noteId, requestDTO);

        ApiResponse<NoteResponseDTO> response = ApiResponse.<NoteResponseDTO>builder()
                .status(HttpStatus.OK.value())
                .success(true)
                .message("와인 노트 수정 성공")
                .data(responseDTO)
                .build();

        return ResponseEntity.ok(response);
    }

    /**
     * 노트 기록 삭제 API
     */
    @DeleteMapping("/{noteId}")
    public ResponseEntity<ApiResponse<Void>> deleteNote(
            @AuthenticationPrincipal CustomOAuth2User customOAuth2User,
            @PathVariable Long noteId) {

        Long userId = customOAuth2User.getUserId();
        noteService.deleteNote(userId, noteId);

        ApiResponse<Void> response = ApiResponse.<Void>builder()
                .status(HttpStatus.OK.value())
                .success(true)
                .message("와인 노트 삭제 성공")
                .data(null)
                .build();

        return ResponseEntity.ok(response);
    }
}