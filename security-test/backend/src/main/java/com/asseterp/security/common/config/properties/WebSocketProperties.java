package com.asseterp.security.common.config.properties;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.util.StringUtils;

import java.time.Duration;
import java.util.UUID;

/**
 * WebSocket(STOMP) 설정 (asseterp.ws.*)
 *
 * @param endpoint          STOMP 엔드포인트 (컨텍스트 경로 이하)
 * @param instanceId        서버 인스턴스 식별자 (비우면 기동 시 무작위 8자리)
 * @param redisChannel      인스턴스 간 메시지 전달용 Redis Pub/Sub 채널
 * @param presenceKey       접속자 현황 Redis HASH 키
 * @param instanceKeyPrefix 인스턴스 생존 키 prefix (뒤에 instanceId가 붙음)
 * @param instanceTtl       인스턴스 생존 키 TTL (sweepInterval보다 충분히 길어야 함)
 * @param sweepInterval     세션 재검증 및 생존 키 갱신 주기
 * @param heartbeat         STOMP heartbeat 주기
 * @param closeDelay        세션 종료 메시지 전송 후 소켓을 닫기까지 대기 시간
 */
@ConfigurationProperties(prefix = "asseterp.ws")
public record WebSocketProperties(
        String endpoint,
        String instanceId,
        String redisChannel,
        String presenceKey,
        String instanceKeyPrefix,
        Duration instanceTtl,
        Duration sweepInterval,
        Duration heartbeat,
        Duration closeDelay
) {
    public WebSocketProperties {
        if (!StringUtils.hasText(instanceId)) {
            instanceId = UUID.randomUUID().toString().substring(0, 8);
        }
    }
}
