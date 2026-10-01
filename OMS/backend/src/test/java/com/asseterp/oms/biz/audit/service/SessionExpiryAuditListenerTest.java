package com.asseterp.oms.biz.audit.service;

import com.asseterp.oms.biz.audit.dto.AuditEventType;
import com.asseterp.oms.biz.audit.dto.AuditResult;
import com.asseterp.oms.biz.user.dto.LoginAccount;
import com.asseterp.oms.biz.user.mapper.AccountMapper;
import com.asseterp.oms.common.config.properties.AuditProperties;
import com.asseterp.oms.common.config.properties.AuthProperties;
import com.asseterp.oms.support.TestProperties;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.data.redis.connection.DefaultMessage;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.ValueOperations;

import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

class SessionExpiryAuditListenerTest {

    private final AuthProperties authProperties = TestProperties.bind("asseterp.auth", AuthProperties.class);
    private final AuditProperties auditProperties = TestProperties.bind("asseterp.audit", AuditProperties.class);
    private final StringRedisTemplate redisTemplate = mock(StringRedisTemplate.class);
    @SuppressWarnings("unchecked")
    private final ValueOperations<String, String> valueOps = mock(ValueOperations.class);
    private final AccountMapper accountMapper = mock(AccountMapper.class);
    private final AuditLogService auditLogService = mock(AuditLogService.class);

    private final SessionExpiryAuditListener listener = new SessionExpiryAuditListener(
            authProperties, auditProperties.sessionExpiry(), redisTemplate, accountMapper, auditLogService);

    @BeforeEach
    void setUp() {
        when(redisTemplate.opsForValue()).thenReturn(valueOps);
        when(accountMapper.findEmployeeById(2L)).thenReturn(Optional.of(new LoginAccount(
                LoginAccount.EMPLOYEE, 2L, 28000L, "kfstest", "한국펀드서비스(주)", "user1", "일반 사용자",
                null, null, null, "100")));
    }

    private void expire(String key) {
        listener.onMessage(new DefaultMessage("__keyevent@0__:expired".getBytes(StandardCharsets.UTF_8),
                key.getBytes(StandardCharsets.UTF_8)), null);
    }

    @Test
    void 세션_키가_만료되면_SESSION_EXPIRED를_기록한다() {
        when(valueOps.setIfAbsent(anyString(), anyString(), any(Duration.class))).thenReturn(true);

        expire(authProperties.sessionKeyPrefix() + "2");

        verify(valueOps).setIfAbsent(eq(auditProperties.sessionExpiry().dedupKeyPrefix() + "2"), anyString(),
                eq(auditProperties.sessionExpiry().dedupTtl()));
        verify(auditLogService).record(eq(AuditEventType.SESSION_EXPIRED), eq(AuditResult.SUCCESS), eq("kfstest:user1"), any(), any());
    }

    @Test
    void 세션_키가_아닌_키의_만료는_무시한다() {
        expire(authProperties.refreshRotation().keyPrefix() + "2");
        expire(authProperties.loginLock().failCountKeyPrefix() + "2");

        verifyNoInteractions(auditLogService);
    }

    @Test
    void 다른_서버가_이미_기록했으면_기록하지_않는다() {
        when(valueOps.setIfAbsent(anyString(), anyString(), any(Duration.class))).thenReturn(false);

        expire(authProperties.sessionKeyPrefix() + "2");

        verifyNoInteractions(auditLogService);
    }
}
