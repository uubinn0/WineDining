package com.ssafy.winedining.global.auth.service;

import com.ssafy.winedining.domain.user.dto.UserDTO;
import com.ssafy.winedining.domain.user.entity.Rank;
import com.ssafy.winedining.domain.user.entity.User;
import com.ssafy.winedining.domain.user.repository.RankRepository;
import com.ssafy.winedining.domain.user.repository.UserRepository;
import com.ssafy.winedining.global.auth.dto.CustomOAuth2User;
import com.ssafy.winedining.global.auth.dto.GoogleResponse;
import com.ssafy.winedining.global.auth.dto.KakaoResponse;
import com.ssafy.winedining.global.auth.dto.OAuth2Response;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

@Service
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final UserRepository userRepository;
    private final RankRepository rankRepository; // Rank 리포지토리 추가

    public CustomOAuth2UserService(UserRepository userRepository, RankRepository rankRepository) {
        this.userRepository = userRepository;
        this.rankRepository = rankRepository;
    }

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(userRequest);
        System.out.println(oAuth2User);

        String registrationId = userRequest.getClientRegistration().getRegistrationId();
        OAuth2Response oAuth2Response = null;
        if (registrationId.equals("kakao")) {
            oAuth2Response = new KakaoResponse(oAuth2User.getAttributes());
        }
        else if (registrationId.equals("google")) {
            oAuth2Response = new GoogleResponse(oAuth2User.getAttributes());
        }
        else {
            return null;
        }

        String username = oAuth2Response.getProvider()+" "+oAuth2Response.getProviderId();
        User existData = userRepository.findByUsername(username);

        if (existData == null) {
            // 기본 랭크(초보자) 가져오기
            Rank beginnerRank = rankRepository.findByName("초보자")
                    .orElseGet(() -> {
                        Rank newRank = new Rank();
                        newRank.setId(1L); // 수동으로 ID 설정
                        newRank.setName("초보자");
                        newRank.setCondition((byte)0);
                        return rankRepository.save(newRank);
                    });

            User userEntity = new User();
            userEntity.setUsername(username);
            userEntity.setEmail(oAuth2Response.getEmail());
            userEntity.setName(oAuth2Response.getName());
            userEntity.setRole("ROLE_USER");
            userEntity.setRank(beginnerRank); // 초보자 랭크 설정

            User savedUser = userRepository.save(userEntity);

            UserDTO userDTO = new UserDTO();
            userDTO.setId(savedUser.getId()); // userId 설정
            userDTO.setUsername(username);
            userDTO.setName(oAuth2Response.getName());
            userDTO.setRole("ROLE_USER");
            userDTO.setRankName("초보자"); // 랭크명 설정

            return new CustomOAuth2User(userDTO);
        }
        else {
//            existData.setEmail(oAuth2Response.getEmail());
//            existData.setName(oAuth2Response.getName());

//            User updatedUser = userRepository.findBy(existData);

            UserDTO userDTO = new UserDTO();
            userDTO.setId(existData.getId()); // userId 설정
            userDTO.setUsername(existData.getUsername());
            userDTO.setName(existData.getName());
            userDTO.setRole(existData.getRole());

            // 랭크 정보 설정
            if (existData.getRank() != null) {
                userDTO.setRankName(existData.getRank().getName());
            } else {
                userDTO.setRankName("초보자"); // 기본값
            }

            return new CustomOAuth2User(userDTO);
        }
    }
}