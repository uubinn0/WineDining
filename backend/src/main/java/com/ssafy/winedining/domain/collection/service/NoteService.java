package com.ssafy.winedining.domain.collection.service;

import com.ssafy.winedining.domain.collection.dto.BottleNotesResponseDTO;
import com.ssafy.winedining.domain.collection.dto.NoteRequestDTO;
import com.ssafy.winedining.domain.collection.dto.NoteResponseDTO;
import com.ssafy.winedining.domain.collection.dto.WineDTO;
import com.ssafy.winedining.domain.collection.entity.Bottle;
import com.ssafy.winedining.domain.collection.entity.WineNote;
import com.ssafy.winedining.domain.collection.repository.BottleRepository;
import com.ssafy.winedining.domain.collection.repository.WineNoteRepository;
import com.ssafy.winedining.domain.wine.entity.CustomWine;
import com.ssafy.winedining.domain.wine.entity.Wine;
import com.ssafy.winedining.global.s3.service.S3Service;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NoteService {

    private final BottleRepository bottleRepository;
    private final WineNoteRepository wineNoteRepository;
    private final S3Service s3Service;

    /**
     * WineNote를 NoteResponseDTO로 변환하는 도우미 메서드
     */
    private NoteResponseDTO convertToNoteResponseDTO(WineNote wineNote) {
        // 문자열에서 리스트로 변환
        List<String> pairingList = new ArrayList<>();
        if (wineNote.getPairing() != null && !wineNote.getPairing().isEmpty()) {
            pairingList = Arrays.asList(wineNote.getPairing().split(","));
        }

        // 이미지 URL 처리
        List<String> imageList = new ArrayList<>();
        if (wineNote.getImage1() != null) imageList.add(wineNote.getImage1());
        if (wineNote.getImage2() != null) imageList.add(wineNote.getImage2());
        if (wineNote.getImage3() != null) imageList.add(wineNote.getImage3());

        return NoteResponseDTO.builder()
                .noteId(wineNote.getId())
                .createdAt(wineNote.getCreatedAt())
                .who(wineNote.getWho())
                .when(wineNote.getWhen())
                .pairing(pairingList)
                .nose(wineNote.getNose())
                .rating(wineNote.getRating())
                .content(wineNote.getContent())
                .image(imageList)
                .build();
    }

    /**
     * 와인별 노트 기록 전체 조회
     */
    @Transactional(readOnly = true)
    public BottleNotesResponseDTO getBottleNotes(Long userId, Long bottleId) {
        // 병 조회 (사용자 확인)
        Bottle bottle = bottleRepository.findById(bottleId)
                .orElseThrow(() -> new NoSuchElementException("존재하지 않는 병입니다."));

        // 사용자 권한 확인
        if (!bottle.getUser().getId().equals(userId)) {
            throw new IllegalArgumentException("해당 병에 대한 접근 권한이 없습니다.");
        }

        // 와인 정보 구성
        WineDTO wineDTO;
        boolean isCustom = false;

        if (bottle.getWine() != null) {
            Wine wine = bottle.getWine();
            wineDTO = WineDTO.builder()
                    .wineId(wine.getId())
                    .name(wine.getKrName())
                    .type(wine.getWineType().getTypeName())
                    .country(wine.getCountry())
                    .grape(wine.getGrape())
                    .image(wine.getImage())
                    .build();
        } else {
            CustomWine customWine = bottle.getCustomWine();
            isCustom = true;
            wineDTO = WineDTO.builder()
                    .wineId(customWine.getId())
                    .name(customWine.getName())
                    .type(customWine.getWineType().getTypeName())
                    .country(customWine.getCountry())
                    .grape(null)
                    .build();
        }

        // 병에 대한 모든 노트 조회
        List<WineNote> notes = wineNoteRepository.findByBottleId(bottleId);

        // 노트 DTO 변환
        List<NoteResponseDTO> noteDTOs = notes.stream()
                .map(this::convertToNoteResponseDTO)
                .collect(Collectors.toList());

        // 병 정보 구성
        BottleNotesResponseDTO.BottleInfo bottleInfo = BottleNotesResponseDTO.BottleInfo.builder()
                .bottleId(bottle.getId())
                .createdAt(bottle.getCreateAt())
                .wine(wineDTO)
                .isCustom(isCustom)
                .isBest(bottle.getBest() != null ? bottle.getBest() : false)
                .totalNote(notes.size())
                .build();

        // 최종 응답 구성
        return BottleNotesResponseDTO.builder()
                .bottle(bottleInfo)
                .notes(noteDTOs)
                .build();
    }

    /**
     * 노트 기록 저장
     */
    @Transactional
    public NoteResponseDTO createNote(Long userId, Long bottleId, NoteRequestDTO requestDTO) {
        // 병 조회 (사용자 확인)
        Bottle bottle = bottleRepository.findById(bottleId)
                .orElseThrow(() -> new NoSuchElementException("존재하지 않는 병입니다."));

        // 사용자 권한 확인
        if (!bottle.getUser().getId().equals(userId)) {
            throw new IllegalArgumentException("해당 병에 대한 접근 권한이 없습니다.");
        }

        // 리스트를 문자열로 변환
        String pairingStr = String.join(",", requestDTO.getPairing());

        // 이미지 URL 처리
        List<String> images = requestDTO.getImage();
        String image1 = images.size() > 0 ? images.get(0) : null;
        String image2 = images.size() > 1 ? images.get(1) : null;
        String image3 = images.size() > 2 ? images.get(2) : null;

        // 노트 생성 및 저장
        WineNote wineNote = WineNote.builder()
                .who(requestDTO.getWho())
                .when(requestDTO.getWhen())
                .pairing(pairingStr)
                .nose(requestDTO.getNose())
                .content(requestDTO.getContent())
                .rating(requestDTO.getRating())
                .image1(image1)
                .image2(image2)
                .image3(image3)
                .createdAt(LocalDateTime.now().toString())
                .bottle(bottle)
                .build();

        WineNote savedNote = wineNoteRepository.save(wineNote);

        // 응답 생성
        return convertToNoteResponseDTO(savedNote);
    }

    /**
     * 노트 기록 저장 (S3 파일 업로드 통합)
     */
    @Transactional
    public NoteResponseDTO createNoteWithImages(Long userId, Long bottleId, NoteRequestDTO requestDTO, List<MultipartFile> imageFiles) {
        // 병 조회 (사용자 확인)
        Bottle bottle = bottleRepository.findById(bottleId)
                .orElseThrow(() -> new NoSuchElementException("존재하지 않는 병입니다."));

        // 사용자 권한 확인
        if (!bottle.getUser().getId().equals(userId)) {
            throw new IllegalArgumentException("해당 병에 대한 접근 권한이 없습니다.");
        }

        // 리스트를 문자열로 변환
        String pairingStr = String.join(",", requestDTO.getPairing());

        // 이미지 파일 처리
        List<String> uploadedImageUrls = new ArrayList<>();
        if (imageFiles != null && !imageFiles.isEmpty()) {
            for (MultipartFile file : imageFiles) {
                try {
                    String imageUrl = s3Service.uploadFile(file, "wine-notes");
                    uploadedImageUrls.add(imageUrl);
                    if (uploadedImageUrls.size() >= 3) {
                        break; // 최대 3개까지만 업로드
                    }
                } catch (IOException e) {
                    throw new RuntimeException("이미지 업로드 중 오류가 발생했습니다: " + e.getMessage());
                }
            }
        }

        // 기존 요청에 있는 이미지 URL과 합침
        if (requestDTO.getImage() != null) {
            for (String existingUrl : requestDTO.getImage()) {
                uploadedImageUrls.add(existingUrl);
                if (uploadedImageUrls.size() >= 3) {
                    break; // 최대 3개까지만 처리
                }
            }
        }

        // 이미지 URL 할당
        String image1 = uploadedImageUrls.size() > 0 ? uploadedImageUrls.get(0) : null;
        String image2 = uploadedImageUrls.size() > 1 ? uploadedImageUrls.get(1) : null;
        String image3 = uploadedImageUrls.size() > 2 ? uploadedImageUrls.get(2) : null;

        // 노트 생성 및 저장
        WineNote wineNote = WineNote.builder()
                .who(requestDTO.getWho())
                .when(requestDTO.getWhen())
                .pairing(pairingStr)
                .nose(requestDTO.getNose())
                .content(requestDTO.getContent())
                .rating(requestDTO.getRating())
                .image1(image1)
                .image2(image2)
                .image3(image3)
                .createdAt(LocalDateTime.now().toString())
                .bottle(bottle)
                .build();

        WineNote savedNote = wineNoteRepository.save(wineNote);

        // 응답 생성
        return convertToNoteResponseDTO(savedNote);
    }

    /**
     * 노트 기록 수정
     */
    @Transactional
    public NoteResponseDTO updateNote(Long userId, Long noteId, NoteRequestDTO requestDTO) {
        // 노트 조회
        WineNote wineNote = wineNoteRepository.findById(noteId)
                .orElseThrow(() -> new NoSuchElementException("존재하지 않는 노트입니다."));

        // 사용자 권한 확인
        if (!wineNote.getBottle().getUser().getId().equals(userId)) {
            throw new IllegalArgumentException("해당 노트에 대한 접근 권한이 없습니다.");
        }

        // 리스트를 문자열로 변환
        String pairingStr = String.join(",", requestDTO.getPairing());

        // 이미지 URL 처리
        List<String> images = requestDTO.getImage();
        String image1 = images.size() > 0 ? images.get(0) : null;
        String image2 = images.size() > 1 ? images.get(1) : null;
        String image3 = images.size() > 2 ? images.get(2) : null;

        // 노트 정보 업데이트
        wineNote.setWho(requestDTO.getWho());
        wineNote.setWhen(requestDTO.getWhen());
        wineNote.setPairing(pairingStr);
        wineNote.setNose(requestDTO.getNose());
        wineNote.setContent(requestDTO.getContent());
        wineNote.setRating(requestDTO.getRating());
        wineNote.setImage1(image1);
        wineNote.setImage2(image2);
        wineNote.setImage3(image3);

        WineNote updatedNote = wineNoteRepository.save(wineNote);

        // 응답 생성
        return convertToNoteResponseDTO(updatedNote);
    }

    /**
     * 노트 기록 수정 (S3 파일 업로드 통합)
     */
    @Transactional
    public NoteResponseDTO updateNoteWithImages(Long userId, Long noteId, NoteRequestDTO requestDTO, List<MultipartFile> imageFiles) {
        // 노트 조회
        WineNote wineNote = wineNoteRepository.findById(noteId)
                .orElseThrow(() -> new NoSuchElementException("존재하지 않는 노트입니다."));

        // 사용자 권한 확인
        if (!wineNote.getBottle().getUser().getId().equals(userId)) {
            throw new IllegalArgumentException("해당 노트에 대한 접근 권한이 없습니다.");
        }

        // 리스트를 문자열로 변환
        String pairingStr = String.join(",", requestDTO.getPairing());

        // 기존 이미지 저장
        List<String> existingImages = new ArrayList<>();
        if (wineNote.getImage1() != null) existingImages.add(wineNote.getImage1());
        if (wineNote.getImage2() != null) existingImages.add(wineNote.getImage2());
        if (wineNote.getImage3() != null) existingImages.add(wineNote.getImage3());

        // 이미지 파일 처리
        List<String> uploadedImageUrls = new ArrayList<>();
        if (imageFiles != null && !imageFiles.isEmpty()) {
            // 새 이미지 업로드 요청이 있으면 기존 이미지 삭제
            for (String existingUrl : existingImages) {
                s3Service.deleteFile(existingUrl);
            }

            // 새 이미지 업로드
            for (MultipartFile file : imageFiles) {
                try {
                    String imageUrl = s3Service.uploadFile(file, "wine-notes");
                    uploadedImageUrls.add(imageUrl);
                    if (uploadedImageUrls.size() >= 3) {
                        break; // 최대 3개까지만 업로드
                    }
                } catch (IOException e) {
                    throw new RuntimeException("이미지 업로드 중 오류가 발생했습니다: " + e.getMessage());
                }
            }
        } else if (requestDTO.getImage() != null && !requestDTO.getImage().equals(existingImages)) {
            // 이미지 URL 변경이 있을 경우 (새 URL 리스트가 기존 URL 리스트와 다른 경우)
            // 기존 이미지 중 새 리스트에 없는 이미지 삭제
            for (String existingUrl : existingImages) {
                if (!requestDTO.getImage().contains(existingUrl)) {
                    s3Service.deleteFile(existingUrl);
                }
            }
            uploadedImageUrls.addAll(requestDTO.getImage());
        } else {
            // 변경 없음
            uploadedImageUrls.addAll(existingImages);
        }

        // 이미지 URL 할당
        String image1 = uploadedImageUrls.size() > 0 ? uploadedImageUrls.get(0) : null;
        String image2 = uploadedImageUrls.size() > 1 ? uploadedImageUrls.get(1) : null;
        String image3 = uploadedImageUrls.size() > 2 ? uploadedImageUrls.get(2) : null;

        // 노트 정보 업데이트
        wineNote.setWho(requestDTO.getWho());
        wineNote.setWhen(requestDTO.getWhen());
        wineNote.setPairing(pairingStr);
        wineNote.setNose(requestDTO.getNose());
        wineNote.setContent(requestDTO.getContent());
        wineNote.setRating(requestDTO.getRating());
        wineNote.setImage1(image1);
        wineNote.setImage2(image2);
        wineNote.setImage3(image3);

        WineNote updatedNote = wineNoteRepository.save(wineNote);

        // 응답 생성
        return convertToNoteResponseDTO(updatedNote);
    }

    /**
     * 노트 기록 삭제
     */
    @Transactional
    public void deleteNote(Long userId, Long noteId) {
        // 노트 조회
        WineNote wineNote = wineNoteRepository.findById(noteId)
                .orElseThrow(() -> new NoSuchElementException("존재하지 않는 노트입니다."));

        // 사용자 권한 확인
        if (!wineNote.getBottle().getUser().getId().equals(userId)) {
            throw new IllegalArgumentException("해당 노트에 대한 접근 권한이 없습니다.");
        }

        // 노트가 연결된 bottle 참조 저장
        Bottle bottle = wineNote.getBottle();

        // 노트 삭제
        wineNoteRepository.delete(wineNote);

        // bottle에 연결된 다른 노트가 있는지 확인
        long remainingNotes = wineNoteRepository.countByBottleId(bottle.getId());

        // 노트가 0개이면 bottle도 삭제
        if (remainingNotes == 0) {
            bottleRepository.delete(bottle);
        }
    }
}