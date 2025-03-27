package com.ssafy.winedining.domain.info.service;

import com.ssafy.winedining.domain.info.dto.InfoDetailResponseDTO;
import com.ssafy.winedining.domain.info.dto.InfoListResponseDTO;
import com.ssafy.winedining.domain.info.entity.Info;
import com.ssafy.winedining.domain.info.entity.InfoDetail;
import com.ssafy.winedining.domain.info.repository.InfoDetailRepository;
import com.ssafy.winedining.domain.info.repository.InfoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class InfoService {

    private final InfoRepository infoRepository;
    private final InfoDetailRepository infoDetailRepository;

    /**
     * 와인 알쓸신잡 목록 조회
     */
    @Transactional(readOnly = true)
    public InfoListResponseDTO getWineInfoList(int page, int limit) {
        // 페이지는 0부터 시작하므로 1을 빼줌
        Pageable pageable = PageRequest.of(page - 1, limit);

        // "wine" 타입의 정보만 조회
        Page<Info> infoPage = infoRepository.findByType("wine", pageable);

        // DTO 변환
        List<InfoListResponseDTO.InfoSummaryDTO> infoDTOs = infoPage.getContent().stream()
                .map(info -> InfoListResponseDTO.InfoSummaryDTO.builder()
                        .id(info.getId())
                        .title(info.getTitle())
                        .build())
                .collect(Collectors.toList());

        // 응답 구성
        return InfoListResponseDTO.builder()
                .infos(infoDTOs)
                .totalCount((int) infoPage.getTotalElements())
                .page(page)
                .totalPages(infoPage.getTotalPages())
                .limit(limit)
                .build();
    }

    /**
     * 와인 알쓸신잡 상세 조회
     */
    @Transactional(readOnly = true)
    public InfoDetailResponseDTO getWineInfoDetail(Long infoId) {
        // 정보 조회
        Info info = infoRepository.findById(infoId)
                .orElseThrow(() -> new NoSuchElementException("존재하지 않는 와인 상식입니다."));

        // 상세 정보 조회 (순서대로)
        List<InfoDetail> details = infoDetailRepository.findByInfoIdOrderByOrder(infoId);

        // 내용 구성 (현재는 첫 번째 detail만 사용)
        String content = "";
        if (!details.isEmpty()) {
            content = details.get(0).getContent();
        }

        // 응답 구성
        return InfoDetailResponseDTO.builder()
                .id(info.getId())
                .title(info.getTitle())
                .content(content)
                .build();
    }
}