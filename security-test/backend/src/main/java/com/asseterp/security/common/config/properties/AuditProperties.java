package com.asseterp.security.common.config.properties;

import org.springframework.boot.context.properties.ConfigurationProperties;

import java.time.Duration;

/**
 * 보안 감사 설정 (asseterp.audit.*)
 *
 * @param sessionExpiry Redis 세션 키 만료 이벤트 기반 세션 만료 감사
 */
@ConfigurationProperties(prefix = "asseterp.audit")
public record AuditProperties(
        SessionExpiry sessionExpiry
) {
    /**
     * @param enabled        세션 만료 이벤트 구독 여부 (Redis notify-keyspace-events Ex 필요)
     * @param dedupKeyPrefix 서버 여러 대 중복 기록 방지용 Redis 키 prefix (뒤에 userId가 붙음)
     * @param dedupTtl       중복 방지 키 유지 시간
     */
    public record SessionExpiry(
            boolean enabled,
            String dedupKeyPrefix,
            Duration dedupTtl
    ) {
    }
}
