package com.asseterp.security.biz.audit.service;

import com.asseterp.security.biz.audit.dto.AuditEventType;
import com.asseterp.security.biz.audit.dto.AuditResult;
import com.asseterp.security.biz.user.dto.LoginAccount;
import com.asseterp.security.biz.user.mapper.AccountMapper;
import com.asseterp.security.common.config.properties.AuditProperties;
import com.asseterp.security.common.config.properties.AuthProperties;
import com.asseterp.security.common.log.MdcKeys;
import com.asseterp.security.common.log.MdcLoggingFilter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.MDC;
import org.springframework.data.redis.connection.Message;
import org.springframework.data.redis.connection.MessageListener;
import org.springframework.data.redis.core.StringRedisTemplate;

import java.nio.charset.StandardCharsets;

/**
 * Redis 키 만료 이벤트(__keyevent@{db}__:expired)를 받아 세션 만료를 감사 로그에 기록한다.
 * <ul>
 *   <li>활성 세션 키(asseterp.auth.session-key-prefix + userId)만 처리하고 나머지 키(rid, 실패 횟수 등)는 무시한다.</li>
 *   <li>로그인(덮어쓰기)·갱신(TTL 연장)·로그아웃(삭제)은 만료 이벤트를 만들지 않으므로, 유휴 시간 초과로 끝난 세션만 기록된다.</li>
 *   <li>서버가 여러 대면 모든 서버가 같은 이벤트를 받으므로 SET NX로 한 대만 기록한다.</li>
 *   <li>Redis Pub/Sub은 저장되지 않으므로, 만료 순간 앱이 내려가 있으면 이 기록은 누락된다
 *       (사용자가 다시 요청하면 AuthService의 REFRESH_REJECTED로 보완).</li>
 * </ul>
 */
@Slf4j
@RequiredArgsConstructor
public class SessionExpiryAuditListener implements MessageListener {

    private final AuthProperties authProperties;
    private final AuditProperties.SessionExpiry settings;
    private final StringRedisTemplate redisTemplate;
    private final AccountMapper accountMapper;
    private final AuditLogService auditLogService;

    @Override
    public void onMessage(Message message, byte[] pattern) {
        String expiredKey = new String(message.getBody(), StandardCharsets.UTF_8);
        String prefix = authProperties.sessionKeyPrefix();
        if (!expiredKey.startsWith(prefix)) {
            return;
        }

        // 요청 밖(리스너 스레드)이므로 추적ID를 새로 발급해 이 이벤트의 로그를 묶는다
        MDC.put(MdcKeys.TRACE_ID, MdcLoggingFilter.newTraceId());
        try {
            Long userId = Long.parseLong(expiredKey.substring(prefix.length()));
            Boolean first = redisTemplate.opsForValue()
                    .setIfAbsent(settings.dedupKeyPrefix() + userId, "1", settings.dedupTtl());
            if (!Boolean.TRUE.equals(first)) {
                return;
            }

            Long accountId = LoginAccount.toAccountId(userId);
            String username = (LoginAccount.isEmployeeSessionId(userId)
                    ? accountMapper.findEmployeeById(accountId)
                    : accountMapper.findManagerById(accountId))
                    .map(LoginAccount::qualifiedUsername)
                    .orElse(String.valueOf(userId));
            log.info("세션 만료 (유휴 시간 초과) - userId: {}, username: {}", userId, username);
            auditLogService.record(AuditEventType.SESSION_EXPIRED, AuditResult.SUCCESS, username, null,
                    "유휴 시간 초과 (Redis 세션 TTL 만료)");
        } catch (RuntimeException e) {
            // 리스너 스레드가 죽지 않도록 예외를 삼키고 기록만 남긴다
            log.error("세션 만료 감사 처리 실패 - key: {}, cause: {}", expiredKey, e.getMessage());
        } finally {
            MDC.clear();
        }
    }
}
