package com.ssafy.winedining.global.common;

import lombok.*;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApiResponse<T> {
    private int status;
    private boolean success;
    private String message;
    private T data;
}
