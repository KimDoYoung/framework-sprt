package com.asseterp.security.common.dto;

import com.asseterp.security.common.error.ErrorCode;

public record ApiResponse<T>(
        boolean success,
        String code,
        String message,
        T data
) {
    private static final String OK = "OK";

    public static <T> ApiResponse<T> ok(T data) {
        return new ApiResponse<>(true, OK, OK, data);
    }

    public static <T> ApiResponse<T> ok(String message, T data) {
        return new ApiResponse<>(true, OK, message, data);
    }

    public static <T> ApiResponse<T> fail(ErrorCode errorCode, String message) {
        return new ApiResponse<>(false, errorCode.name(), message, null);
    }

    public static <T> ApiResponse<T> fail(String code, String message) {
        return new ApiResponse<>(false, code, message, null);
    }
}
