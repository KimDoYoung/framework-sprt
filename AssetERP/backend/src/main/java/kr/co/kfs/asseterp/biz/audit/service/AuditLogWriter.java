package kr.co.kfs.asseterp.biz.audit.service;

import kr.co.kfs.asseterp.biz.audit.dto.AuditLogRecord;
import kr.co.kfs.asseterp.biz.audit.mapper.AuditLogMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

/**
 * 감사 로그 DB 등록 전용.
 * 로그인 실패처럼 기록 직후 예외가 발생해 업무 트랜잭션이 롤백되어도 감사 기록은 남아야 하므로 별도 트랜잭션으로 커밋한다.
 * (AuditLogService가 예외를 잡을 수 있도록 트랜잭션 경계를 별도 빈으로 분리)
 */
@Component
@RequiredArgsConstructor
class AuditLogWriter {

    private final AuditLogMapper auditLogMapper;

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void insert(AuditLogRecord auditLog) {
        auditLogMapper.insert(auditLog);
    }
}
