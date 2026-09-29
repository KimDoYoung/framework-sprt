package com.asseterp.security.common.jwt;

import com.asseterp.security.common.dto.ApiResponse;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.MediaType;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class JwtAuthenticationEntryPoint implements AuthenticationEntryPoint {

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public void commence(HttpServletRequest request,
                         HttpServletResponse response,
                         AuthenticationException authException) throws IOException {

        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setCharacterEncoding("UTF-8");
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);

        String authError = (String) request.getAttribute("AUTH_ERROR");
        String message;
        String errorCode;

        if ("MULTI_LOGIN_DETECTED".equals(authError)) {
            message = "다른 기기/브라우저에서 로그인되어 현재 세션이 차단되었습니다.";
            errorCode = "MULTI_LOGIN_DETECTED";
        } else if ("TOKEN_EXPIRED_OR_INVALID".equals(authError)) {
            message = "인증 토큰이 만료되었거나 유효하지 않습니다.";
            errorCode = "TOKEN_EXPIRED";
        } else {
            message = "로그인이 필요한 서비스입니다.";
            errorCode = "UNAUTHORIZED";
        }

        response.setHeader("X-Auth-Error", errorCode);
        ApiResponse<String> apiResponse = ApiResponse.fail(message, errorCode);
        response.getWriter().write(objectMapper.writeValueAsString(apiResponse));
    }
}
