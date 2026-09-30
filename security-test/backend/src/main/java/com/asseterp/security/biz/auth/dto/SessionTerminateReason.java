package com.asseterp.security.biz.auth.dto;

import com.asseterp.security.common.error.ErrorCode;
import lombok.Getter;

/**
 * 세션 종료 사유. 이름은 프론트엔드 SessionTerminateReason(src/api/client.ts)과 같다.
 */
@Getter
public enum SessionTerminateReason {
    /** 다른 곳에서 새로 로그인 → 이전 세션 종료 */
    MULTI_LOGIN(ErrorCode.MULTI_LOGIN_DETECTED, "동시 접속 차단", ErrorCode.MULTI_LOGIN_DETECTED.getMessage()),
    /** 교체된 Refresh Token 재사용 탐지 → 세션 폐기 */
    TOKEN_REUSED(ErrorCode.REFRESH_TOKEN_REUSED, "토큰 재사용 감지", ErrorCode.REFRESH_TOKEN_REUSED.getMessage()),
    /** 계정 잠금 */
    ACCOUNT_LOCKED(ErrorCode.ACCOUNT_LOCKED, "계정 잠금", ErrorCode.ACCOUNT_LOCKED.getMessage()),
    /** 로그아웃 (같은 세션을 쓰는 다른 탭 동기화) */
    LOGOUT(null, "로그아웃", "로그아웃되어 세션이 종료되었습니다."),
    /** 유휴 시간 초과 등으로 Redis 세션이 사라짐 */
    EXPIRED(ErrorCode.REFRESH_EXPIRED, "세션 만료", ErrorCode.REFRESH_EXPIRED.getMessage());

    /** 대응하는 HTTP 에러 코드 (없으면 null) */
    private final ErrorCode errorCode;
    private final String title;
    private final String message;

    SessionTerminateReason(ErrorCode errorCode, String title, String message) {
        this.errorCode = errorCode;
        this.title = title;
        this.message = message;
    }
}
