package kr.co.kfs.asseterp.common.config.properties;

import org.springframework.boot.context.properties.ConfigurationProperties;

import java.time.Duration;
import java.util.List;

/**
 * Redis 접속 호스트 자동 탐색 설정 (asseterp.redis.*)
 *
 * @param fallbackHosts  spring.data.redis.host 접속 실패 시 순서대로 시도할 호스트 (도커 별칭, 브릿지 게이트웨이 등)
 * @param connectTimeout 호스트별 접속 확인 타임아웃
 */
@ConfigurationProperties(prefix = "asseterp.redis")
public record RedisProbeProperties(
        List<String> fallbackHosts,
        Duration connectTimeout
) {
}
