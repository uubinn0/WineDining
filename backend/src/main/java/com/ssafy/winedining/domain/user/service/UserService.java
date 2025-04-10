package com.ssafy.winedining.domain.user.service;

import com.ssafy.winedining.domain.collection.entity.WineNote;
import com.ssafy.winedining.domain.collection.repository.BottleRepository;
import com.ssafy.winedining.domain.collection.repository.WineNoteRepository;
import com.ssafy.winedining.domain.collection.repository.WishItemRepository;
import com.ssafy.winedining.domain.food.repository.FoodRepository;
import com.ssafy.winedining.domain.preference.entity.Preference;
import com.ssafy.winedining.domain.preference.repository.PreferenceRepository;
import com.ssafy.winedining.domain.preference.service.PreferenceService;
import com.ssafy.winedining.domain.user.dto.ProfileUpdateRequestDTO;
import com.ssafy.winedining.domain.user.dto.UserResponseDTO;
import com.ssafy.winedining.domain.user.dto.WithdrawalRequestDTO;
import com.ssafy.winedining.domain.user.entity.User;
import com.ssafy.winedining.domain.user.repository.UserRepository;
import com.ssafy.winedining.global.exception.CustomException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PreferenceRepository preferenceRepository;
    private final BottleRepository bottleRepository;
    private final WishItemRepository wishItemRepository;
    private final FoodRepository foodRepository;
    private final WineNoteRepository wineNoteRepository;

    @Value("${server.domain}")
    private String serverDomain;

    private final String WITHDRAWAL_CONFIRMATION = "회원 탈퇴에 동의합니다";

    @Transactional(readOnly = true)
    public UserResponseDTO getUserProfile(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NoSuchElementException("사용자를 찾을 수 없습니다."));

        List<Preference> preferences = preferenceRepository.findByUserId(userId);
        boolean hasPreference = !preferences.isEmpty();

        return UserResponseDTO.builder()
                .userId(user.getId())
                .nickname(user.getName())  // name을 nickname으로 사용
                .email(user.getEmail())
                .rank(user.getRank() != null ? user.getRank().getName() : "초보자")
                .preference(hasPreference)
                .build();
    }

    /**
     * 사용자 프로필 업데이트 (닉네임 변경)
     */
    @Transactional
    public UserResponseDTO updateProfile(Long userId, ProfileUpdateRequestDTO requestDTO) {
        // 사용자 조회
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NoSuchElementException("존재하지 않는 사용자입니다."));

        // 닉네임 중복 검사 (자신의 기존 닉네임이 아닌 경우에만)
        String newNickname = requestDTO.getNickname();
//        if (!newNickname.equals(user.getNickname())) {
//            boolean exists = userRepository.existsByNickname(newNickname);
//            if (exists) {
//                throw new IllegalArgumentException("이미 사용 중인 닉네임입니다.");
//            }
//        }

        // 닉네임 업데이트
        user.setName(newNickname);

        // 사용자 저장
        User updatedUser = userRepository.save(user);

        // 등급 정보 가져오기 (랭크 테이블 관계를 가정)
        String rank = "Bronze"; // 기본값
        if (updatedUser.getRank() != null) {
            rank = updatedUser.getRank().getName();
        }

        List<Preference> preferences = preferenceRepository.findByUserId(userId);
        boolean hasPreference = !preferences.isEmpty();

        // 응답 생성
        return UserResponseDTO.builder()
                .userId(updatedUser.getId())
                .nickname(updatedUser.getName())
                .email(updatedUser.getEmail())
                .rank(rank)
                .preference(hasPreference)
                .build();
    }

    /**
     * 회원 탈퇴 처리 - 하이브리드 접근법
     * 1. 개인정보 익명화
     * 2. 개인 취향 데이터 삭제
     * 3. 개인 컬렉션 데이터 삭제
     * 4. 리뷰는 익명화하여 유지
     *
     * @param userId 탈퇴할 사용자의 ID
     * @param request 탈퇴 요청 정보
     * @param response HTTP 응답 객체 (쿠키 처리용)
     */
    @Transactional
    public void withdrawUser(Long userId, WithdrawalRequestDTO request, HttpServletResponse response) {
        // 1. 사용자 확인
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NoSuchElementException("존재하지 않는 사용자입니다."));

        // 2. 탈퇴 확인 문구 검증
        if (request.getConfirmMessage() == null || !request.getConfirmMessage().equals(WITHDRAWAL_CONFIRMATION)) {
            throw new CustomException(HttpStatus.BAD_REQUEST, "탈퇴 확인 문구가 일치하지 않습니다.");
        }

        // 3. 삭제해도 괜찮은 개인 데이터는 직접 삭제
        // 3.1. 위시리스트 삭제
        wishItemRepository.deleteByUserId(userId);

        // 3.2. 취향 정보 삭제
        preferenceRepository.deleteByUserId(userId);

        // 4. 유지해야 할 데이터는 사용자 연결 해제 또는 익명화
        // 4.1. 와인 리뷰는 유지하되 익명으로 처리
        List<WineNote> userNotes = wineNoteRepository.findByBottleUserId(userId);
        for (WineNote note : userNotes) {
            note.setWho("탈퇴한 사용자");
            wineNoteRepository.save(note);
        }

        // 5. 사용자 개인정보 익명화
        String anonymousUsername = "deleted_" + UUID.randomUUID().toString().substring(0, 8);
        user.setUsername(anonymousUsername);
        user.setEmail(null); // 이메일 제거
        user.setName("탈퇴한 사용자");

        // 7. 변경된 사용자 정보 저장
        userRepository.save(user);

        // 8. 로그아웃 처리 (쿠키 삭제)
        Cookie cookie = new Cookie("Authorization", null);
        cookie.setMaxAge(0);
        cookie.setPath("/");
        cookie.setHttpOnly(true);

        // 서버 도메인이 localhost가 아닐 경우 secure 및 도메인 설정
        if (!serverDomain.equals("localhost")) {
            cookie.setSecure(true);
            cookie.setDomain(serverDomain);
        }

        response.addCookie(cookie);
    }
}