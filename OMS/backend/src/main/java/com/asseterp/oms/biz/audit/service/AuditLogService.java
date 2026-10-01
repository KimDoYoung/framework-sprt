package com.asseterp.oms.biz.audit.service;

import com.asseterp.oms.biz.audit.dto.AuditEventType;
import com.asseterp.oms.biz.audit.dto.AuditLogRecord;
import com.asseterp.oms.biz.audit.dto.AuditResult;
import com.asseterp.oms.biz.audit.mapper.AuditLogMapper;
import com.asseterp.oms.common.log.MdcKeys;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.util.List;

/**
 * 보안 감사 로그. 한 이벤트를 ① audit 로그 파일("AUDIT" 로거)과 ② sys71_security_audit_log 테이블에 함께 기록한다.
 * 추적ID/클라이언트 IP는 MDC(MdcLoggingFilter)에서, User-Agent는 현재 요청에서 읽는다.
 * 비밀번호·토큰 원문은 detail에 넣지 않는다 (jti 등 식별자만 허용).
 * record()는 호출한 쪽 트랜잭션에 참여하지 않는다 (DB 등록은 AuditLogWriter의 별도 트랜잭션).
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class AuditLogService {

    private static final Logger auditLog = LoggerFactory.getLogger("AUDIT");
    private static final int MAX_LIST_LIMIT = 1000;

    private final AuditLogWriter auditLogWriter;
    private final AuditLogMapper auditLogMapper;

    /**
     * 감사 이벤트 기록. DB 등록에 실패해도 업무 처리를 막지 않는다 (파일 기록은 이미 완료된 상태).
     *
     * @param userId   행위자 로그인 아이디 (모르면 null)
     * @param targetId 대상 식별자 (없으면 null)
     * @param detail   부가 설명 (없으면 null)
     */
    public void record(AuditEventType eventType, AuditResult result, String userId, String targetId, String detail) {
        AuditLogRecord record = new AuditLogRecord(
                null,
                eventType.name(),
                result.name(),
                limit(userId, 50),
                limit(targetId, 100),
                limit(detail, 500),
                MDC.get(MdcKeys.CLIENT_IP),
                limit(currentUserAgent(), 300),
                MDC.get(MdcKeys.TRACE_ID),
                null);

        auditLog.info("event={} result={} user={} target={} detail=\"{}\"",
                record.eventType(), record.result(), orDash(record.userId()), orDash(record.targetId()),
                record.detail() != null ? record.detail() : "");

        try {
            auditLogWriter.insert(record);
        } catch (RuntimeException e) {
            log.error("감사 로그 DB 기록 실패 (파일에는 기록됨) - event: {}, user: {}, cause: {}",
                    record.eventType(), record.userId(), e.getMessage());
        }
    }

    @Transactional(readOnly = true)
    public List<AuditLogRecord> searchAuditLogs(int limit) {
        return auditLogMapper.findRecent(Math.min(Math.max(limit, 1), MAX_LIST_LIMIT));
    }

    private String currentUserAgent() {
        if (RequestContextHolder.getRequestAttributes() instanceof ServletRequestAttributes attributes) {
            HttpServletRequest request = attributes.getRequest();
            return request.getHeader(HttpHeaders.USER_AGENT);
        }
        return null;
    }

    /**
     * 로그 위조 방지: 사용자 입력(아이디 등)의 줄바꿈을 제거하고 컬럼 길이에 맞춘다.
     */
    static String limit(String value, int maxLength) {
        if (value == null) {
            return null;
        }
        String sanitized = value.replaceAll("[\\r\\n\\t]", " ").replace('"', '\'');
        return sanitized.length() <= maxLength ? sanitized : sanitized.substring(0, maxLength);
    }

    private static String orDash(String value) {
        return value != null ? value : "-";
    }
}
