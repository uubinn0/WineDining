package com.ssafy.winedining.domain.preference.controller;

import com.ssafy.winedining.domain.preference.service.PreferenceService;
import com.ssafy.winedining.domain.preference.dto.request.PreferenceTestRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/v1/preference")
public class PreferenceController {

    private final PreferenceService preferenceService;

    /**
     * 사용자에게 취향 추천 테스트를 입력 받아 저장합니다.
     *
     * @param request
     * @return
     */
    @PostMapping("/test")
    public String getPreferenceTest(@RequestBody PreferenceTestRequest request){
        // 유저 컨텍스트에서 유저ID 받기
        Long userId = 1L;
        preferenceService.saveUserPreferenceTest(userId, request);
        return "저장 완료";
    }

}
