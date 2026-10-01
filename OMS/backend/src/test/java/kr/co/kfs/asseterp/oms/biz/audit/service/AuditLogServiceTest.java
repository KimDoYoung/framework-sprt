package kr.co.kfs.asseterp.oms.biz.audit.service;

import kr.co.kfs.asseterp.oms.biz.audit.dto.AuditEventType;
import kr.co.kfs.asseterp.oms.biz.audit.dto.AuditLogRecord;
import kr.co.kfs.asseterp.oms.biz.audit.dto.AuditResult;
import kr.co.kfs.asseterp.oms.biz.audit.mapper.AuditLogMapper;
import kr.co.kfs.asseterp.oms.common.log.MdcKeys;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.slf4j.MDC;
import org.springframework.dao.DataAccessResourceFailureException;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatCode;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class AuditLogServiceTest {

    private final AuditLogWriter auditLogWriter = mock(AuditLogWriter.class);
    private final AuditLogService auditLogService = new AuditLogService(auditLogWriter, mock(AuditLogMapper.class));

    @AfterEach
    void tearDown() {
        MDC.clear();
    }

    @Test
    void 추적ID와_IP를_MDC에서_읽어_DB에_기록한다() {
        MDC.put(MdcKeys.TRACE_ID, "abcdef0123456789");
        MDC.put(MdcKeys.CLIENT_IP, "10.0.0.1");

        auditLogService.record(AuditEventType.LOGIN_FAIL, AuditResult.FAIL, "user1", null, "비밀번호 불일치 (1/2)");

        ArgumentCaptor<AuditLogRecord> captor = ArgumentCaptor.forClass(AuditLogRecord.class);
        verify(auditLogWriter).insert(captor.capture());
        AuditLogRecord record = captor.getValue();
        assertThat(record.eventType()).isEqualTo("LOGIN_FAIL");
        assertThat(record.result()).isEqualTo("FAIL");
        assertThat(record.userId()).isEqualTo("user1");
        assertThat(record.traceId()).isEqualTo("abcdef0123456789");
        assertThat(record.clientIp()).isEqualTo("10.0.0.1");
    }

    @Test
    void DB_기록이_실패해도_예외를_전파하지_않는다() {
        doThrow(new DataAccessResourceFailureException("db down")).when(auditLogWriter).insert(any());

        assertThatCode(() -> auditLogService.record(AuditEventType.LOGOUT, AuditResult.SUCCESS, "user1", null, null))
                .doesNotThrowAnyException();
    }

    @Test
    void 사용자_입력의_줄바꿈을_제거하고_컬럼_길이로_자른다() {
        auditLogService.record(AuditEventType.LOGIN_FAIL, AuditResult.FAIL,
                "evil\nevent=LOGIN_SUCCESS" + "x".repeat(100), null, null);

        ArgumentCaptor<AuditLogRecord> captor = ArgumentCaptor.forClass(AuditLogRecord.class);
        verify(auditLogWriter).insert(captor.capture());
        assertThat(captor.getValue().userId()).doesNotContain("\n").hasSize(50);
    }
}
