package com.asseterp.security.common.error;

import lombok.Getter;
import org.springframework.http.HttpStatus;

/**
 * 공통 에러 코드. 401 계열 코드는 X-Auth-Error 헤더로도 내려가 프론트엔드 인터셉터가 분기에 사용한다.
 */
@Getter
public enum ErrorCode {

    // 인증 (401)
    UNAUTHORIZED(HttpStatus.UNAUTHORIZED, "로그인이 필요한 서비스입니다."),
    LOGIN_FAILED(HttpStatus.UNAUTHORIZED, "아이디 또는 비밀번호가 올바르지 않습니다."),
    ACCOUNT_LOCKED(HttpStatus.UNAUTHORIZED, "로그인 실패 횟수 초과로 계정이 잠겼습니다. 관리자에게 잠금 해제를 요청하세요."),
    TOKEN_EXPIRED(HttpStatus.UNAUTHORIZED, "인증 토큰이 만료되었습니다."),
    INVALID_TOKEN(HttpStatus.UNAUTHORIZED, "유효하지 않은 인증 토큰입니다."),
    REFRESH_EXPIRED(HttpStatus.UNAUTHORIZED, "세션이 만료되었습니다. 다시 로그인해주세요."),
    SESSION_NOT_FOUND(HttpStatus.UNAUTHORIZED, "세션 정보가 없습니다. 다시 로그인해주세요."),
    MULTI_LOGIN_DETECTED(HttpStatus.UNAUTHORIZED, "다른 기기/브라우저에서 로그인되어 현재 세션이 차단되었습니다."),
    REFRESH_TOKEN_REUSED(HttpStatus.UNAUTHORIZED, "이미 사용된 인증 토큰이 재사용되어 보안을 위해 세션을 종료했습니다. 다시 로그인해주세요."),

    // 인가 (403)
    ACCESS_DENIED(HttpStatus.FORBIDDEN, "접근 권한이 없습니다."),

    // 사용자
    USER_NOT_FOUND(HttpStatus.NOT_FOUND, "사용자를 찾을 수 없습니다."),

    // 파일
    INVALID_FILE(HttpStatus.BAD_REQUEST, "허용되지 않는 파일입니다."),
    FILE_NOT_FOUND(HttpStatus.NOT_FOUND, "파일을 찾을 수 없습니다."),

    // 시스템
    SESSION_STORE_UNAVAILABLE(HttpStatus.SERVICE_UNAVAILABLE, "세션 저장소(Redis)에 연결할 수 없습니다."),
    INTERNAL_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "서버 내부 오류가 발생했습니다.");

    public static final String AUTH_ERROR_HEADER = "X-Auth-Error";

    private final HttpStatus status;
    private final String message;

    ErrorCode(HttpStatus status, String message) {
        this.status = status;
        this.message = message;
    }

    public boolean isAuthError() {
        return status == HttpStatus.UNAUTHORIZED;
    }
}
