package com.asseterp.security.biz.audit.dto;

import java.time.LocalDateTime;

/**
 * 보안 감사 로그 1건 (sys71_security_audit_log). 등록 시 auditId/createdAt은 null.
 *
 * @param userId   행위자 {회사코드}:{로그인ID} (UserPrincipal.username)
 * @param targetId 대상 식별자 (잠금 해제 대상 사용자, 파일ID 등)
 * @param traceId  요청 추적 ID (애플리케이션 로그 검색 키)
 */
public record AuditLogRecord(
        Long auditId,
        String eventType,
        String result,
        String userId,
        String targetId,
        String detail,
        String clientIp,
        String userAgent,
        String traceId,
        LocalDateTime createdAt
) {
}
