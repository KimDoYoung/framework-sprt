package com.asseterp.security.biz.audit.dto;

/**
 * 보안 감사 이벤트 유형 (sys71_security_audit_log.event_type)
 */
public enum AuditEventType {
    LOGIN_SUCCESS,
    /** 없는 아이디 또는 비밀번호 불일치 */
    LOGIN_FAIL,
    /** 연속 실패로 계정 잠금 */
    ACCOUNT_LOCKED,
    /** 잠긴 계정으로 로그인 시도 */
    LOGIN_LOCKED_ATTEMPT,
    /** 관리자 잠금 해제 */
    ACCOUNT_UNLOCKED,
    LOGOUT,
    /** 다른 곳의 새 로그인으로 이전 세션 차단 */
    MULTI_LOGIN_BLOCKED,
    /** 이미 교체된 Refresh Token 재사용 탐지 → 세션 폐기 */
    TOKEN_REUSED,
    /** 유휴 시간 초과로 세션 종료 (Redis 세션 키 TTL 만료 이벤트, 실제 종료 시각) */
    SESSION_EXPIRED,
    /** 토큰 갱신 거부: Refresh Token 만료 또는 세션 없음 (만료 후 사용자가 다시 요청한 시점) */
    REFRESH_REJECTED,
    FILE_UPLOAD,
    /** 허용되지 않는 형식/위변조 의심으로 업로드 거부 */
    FILE_UPLOAD_REJECTED,
    FILE_DOWNLOAD,
    /** WebSocket 연결 (STOMP CONNECT 완료) */
    WS_CONNECT,
    /** WebSocket 연결 종료 (클라이언트 종료, 네트워크 단절, 강제 종료 모두) */
    WS_DISCONNECT,
    /** 세션 종료 사유(멀티 로그인, 로그아웃, 만료 등)로 서버가 WebSocket을 강제 종료 */
    WS_FORCED_CLOSE,
    /** 관리자 전체 공지 발송 */
    NOTICE_BROADCAST,
    /** 관리자 개인 알림 발송 */
    NOTIFICATION_SEND
}
