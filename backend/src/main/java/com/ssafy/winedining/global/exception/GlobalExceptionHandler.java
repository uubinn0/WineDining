package com.ssafy.winedining.global.exception;

import com.ssafy.winedining.global.common.ApiResponse;
import org.springframework.dao.InvalidDataAccessApiUsageException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.NoSuchElementException;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(NoSuchElementException.class)
    public ResponseEntity<ApiResponse<String>> handleNoSuchElementException(NoSuchElementException e) {
        ApiResponse<String> response = ApiResponse.<String>builder()
                .status(HttpStatus.NOT_FOUND.value())
                .success(false)
                .message(e.getMessage())
                .data(null)
                .build();

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
    }

    // 인증 예외 핸들러 추가
    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<ApiResponse<String>> handleAuthenticationException(AuthenticationException e) {
        ApiResponse<String> response = ApiResponse.<String>builder()
                .status(HttpStatus.UNAUTHORIZED.value())
                .success(false)
                .message("인증이 필요합니다.")
                .data(null)
                .build();

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<String>> handleException(Exception e) {
        ApiResponse<String> response = ApiResponse.<String>builder()
                .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
                .success(false)
                .message("서버 오류가 발생했습니다.")
                .data(null)
                .build();

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }

    @ExceptionHandler(InvalidDataAccessApiUsageException.class)
    public ResponseEntity<ApiResponse<String>> handleInvalidDataAccessApiUsageException(InvalidDataAccessApiUsageException e) {
        ApiResponse<String> response = ApiResponse.<String>builder()
                .status(HttpStatus.BAD_REQUEST.value())
                .success(false)
                .message("유효하지 않은 사용자 정보입니다.")
                .data(null)
                .build();

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }
}