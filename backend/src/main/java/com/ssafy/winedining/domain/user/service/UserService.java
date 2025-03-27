package com.ssafy.winedining.domain.user.service;

import com.ssafy.winedining.domain.preference.entity.Preference;
import com.ssafy.winedining.domain.preference.repository.PreferenceRepository;
import com.ssafy.winedining.domain.preference.service.PreferenceService;
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
}