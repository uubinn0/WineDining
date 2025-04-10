package com.ssafy.winedining.domain.user.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserResponseDTO {
    private Long userId;
    private String nickname;
    private String email;
    private String rank;
    private Boolean preference;
}
