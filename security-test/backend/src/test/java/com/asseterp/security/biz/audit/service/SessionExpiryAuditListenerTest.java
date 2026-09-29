package com.asseterp.security.biz.audit.service;

import com.asseterp.security.biz.audit.dto.AuditEventType;
import com.asseterp.security.biz.audit.dto.AuditResult;
import com.asseterp.security.biz.user.entity.AppUser;
import com.asseterp.security.biz.user.mapper.AppUserMapper;
import com.asseterp.security.common.config.properties.AuditProperties;
import com.asseterp.security.common.config.properties.AuthProperties;
import com.asseterp.security.support.TestProperties;
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
    private final AppUserMapper appUserMapper = mock(AppUserMapper.class);
    private final AuditLogService auditLogService = mock(AuditLogService.class);

    private final SessionExpiryAuditListener listener = new SessionExpiryAuditListener(
            authProperties, auditProperties.sessionExpiry(), redisTemplate, appUserMapper, auditLogService);

    @BeforeEach
    void setUp() {
        when(redisTemplate.opsForValue()).thenReturn(valueOps);
        when(appUserMapper.findById(2L)).thenReturn(Optional.of(
                AppUser.builder().userId(2L).username("user1").build()));
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
        verify(auditLogService).record(eq(AuditEventType.SESSION_EXPIRED), eq(AuditResult.SUCCESS), eq("user1"), any(), any());
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
