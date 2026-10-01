package com.asseterp.oms.common.error;

import com.asseterp.oms.common.dto.ApiResponse;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;

import java.io.IOException;

/**
 * Security 필터 단계(컨트롤러 밖)에서 ApiResponse 형식의 에러 응답을 직접 기록한다.
 */
@Component
@RequiredArgsConstructor
public class ErrorResponseWriter {

    private final ObjectMapper objectMapper;

    public void write(HttpServletResponse response, ErrorCode errorCode) throws IOException {
        write(response, errorCode, errorCode.getMessage());
    }

    public void write(HttpServletResponse response, ErrorCode errorCode, String message) throws IOException {
        response.setStatus(errorCode.getStatus().value());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setCharacterEncoding("UTF-8");
        if (errorCode.isAuthError()) {
            response.setHeader(ErrorCode.AUTH_ERROR_HEADER, errorCode.name());
        }
        response.getWriter().write(objectMapper.writeValueAsString(ApiResponse.fail(errorCode, message)));
    }
}
