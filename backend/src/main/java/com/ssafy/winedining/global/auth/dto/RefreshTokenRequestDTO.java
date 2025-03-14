package com.ssafy.winedining.global.auth.dto;

import com.ssafy.winedining.global.exception.ValidationMessage;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class RefreshTokenRequestDTO {

    @NotBlank(message = ValidationMessage.REFRESH_TOKEN_NOT_EMPTY)
    private String refreshToken;
}