package com.asseterp.oms.common.jwt;

import com.asseterp.oms.common.error.ErrorCode;
import com.asseterp.oms.common.error.ErrorResponseWriter;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import java.io.IOException;

/**
 * 인증되지 않은 요청에 401 + X-Auth-Error 헤더로 응답한다.
 * 실패 사유는 JwtAuthenticationFilter가 request 속성으로 전달한다.
 */
@Component
@RequiredArgsConstructor
public class JwtAuthenticationEntryPoint implements AuthenticationEntryPoint {

    private final ErrorResponseWriter errorResponseWriter;

    @Override
    public void commence(HttpServletRequest request,
                         HttpServletResponse response,
                         AuthenticationException authException) throws IOException {

        Object authError = request.getAttribute(JwtAuthenticationFilter.AUTH_ERROR_ATTRIBUTE);
        ErrorCode errorCode = authError instanceof ErrorCode code ? code : ErrorCode.UNAUTHORIZED;
        errorResponseWriter.write(response, errorCode);
    }
}
