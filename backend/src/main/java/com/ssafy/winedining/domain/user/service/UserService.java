package com.ssafy.winedining.domain.user.service;

import com.ssafy.winedining.domain.preference.entity.Preference;
import com.ssafy.winedining.domain.preference.repository.PreferenceRepository;
import com.ssafy.winedining.domain.preference.service.PreferenceService;
import com.ssafy.winedining.domain.user.dto.ProfileUpdateRequestDTO;
import com.ssafy.winedining.domain.user.dto.UserResponseDTO;
import com.ssafy.winedining.domain.user.entity.User;
import com.ssafy.winedining.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.NoSuchElementException;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PreferenceRepository preferenceRepository;

    @Transactional(readOnly = true)
    public UserResponseDTO getUserProfile(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NoSuchElementException("사용자를 찾을 수 없습니다."));

        Optional<Preference> preference = preferenceRepository.findByUserId(userId);

        return UserResponseDTO.builder()
                .userId(user.getId())
                .nickname(user.getName())  // name을 nickname으로 사용
                .email(user.getEmail())
                .rank(user.getRank() != null ? user.getRank().getName() : "초보자")
                .preference(preference.isPresent())
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

        Optional<Preference> preference = preferenceRepository.findFirstByUserIdOrderByUpdatedAtDesc(userId);

        // 응답 생성
        return UserResponseDTO.builder()
                .userId(updatedUser.getId())
                .nickname(updatedUser.getName())
                .email(updatedUser.getEmail())
                .rank(rank)
                .preference(preference.isPresent())
                .build();
    }
}