package com.asseterp.security.common.error;

import com.asseterp.security.common.dto.ApiResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.ErrorResponse;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<ApiResponse<Void>> handleBusinessException(BusinessException e) {
        log.warn("업무 예외: code={}, message={}", e.getErrorCode(), e.getMessage());
        return toResponse(e.getErrorCode(), e.getMessage());
    }

    /**
     * 메서드 보안(@PreAuthorize) 거부. 컨트롤러까지 온 요청은 이미 인증된 상태이므로 403으로 응답한다.
     */
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ApiResponse<Void>> handleAccessDenied(AccessDeniedException e) {
        return toResponse(ErrorCode.ACCESS_DENIED, ErrorCode.ACCESS_DENIED.getMessage());
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Void>> handleException(Exception e) {
        // Spring MVC 표준 예외(404 리소스 없음, 405, 업로드 크기 초과 등)는 원래 상태 코드를 유지
        if (e instanceof ErrorResponse errorResponse) {
            int status = errorResponse.getStatusCode().value();
            log.warn("요청 처리 실패: status={}, message={}", status, e.getMessage());
            return ResponseEntity.status(status)
                    .body(ApiResponse.fail("HTTP_" + status, e.getMessage()));
        }
        log.error("처리되지 않은 예외", e);
        return toResponse(ErrorCode.INTERNAL_ERROR, ErrorCode.INTERNAL_ERROR.getMessage());
    }

    private ResponseEntity<ApiResponse<Void>> toResponse(ErrorCode errorCode, String message) {
        ResponseEntity.BodyBuilder builder = ResponseEntity.status(errorCode.getStatus());
        if (errorCode.isAuthError()) {
            builder.header(ErrorCode.AUTH_ERROR_HEADER, errorCode.name());
        }
        return builder.body(ApiResponse.fail(errorCode, message));
    }
}
