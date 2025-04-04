package com.ssafy.winedining.domain.user.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class WithdrawalRequestDTO {
    // 회원 탈퇴 확인을 위한 문구 (예: "회원 탈퇴에 동의합니다")
    private String confirmMessage;

}