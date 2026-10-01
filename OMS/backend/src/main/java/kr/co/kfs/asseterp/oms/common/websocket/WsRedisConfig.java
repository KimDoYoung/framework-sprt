package kr.co.kfs.asseterp.oms.common.websocket;

import kr.co.kfs.asseterp.oms.common.config.properties.WebSocketProperties;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.listener.ChannelTopic;
import org.springframework.data.redis.listener.RedisMessageListenerContainer;

/**
 * 인스턴스 간 WebSocket 메시지 전달용 Redis 구독.
 * 세션 만료 감사(SessionExpiryAuditConfig)의 컨테이너는 설정에 따라 없을 수 있으므로 별도로 둔다.
 */
@Slf4j
@Configuration
public class WsRedisConfig {

    @Bean
    public RedisMessageListenerContainer wsRedisListenerContainer(RedisConnectionFactory connectionFactory,
                                                                  WsRedisSubscriber subscriber,
                                                                  WebSocketProperties properties) {
        RedisMessageListenerContainer container = new RedisMessageListenerContainer();
        container.setConnectionFactory(connectionFactory);
        container.addMessageListener(subscriber, new ChannelTopic(properties.redisChannel()));
        log.info("WebSocket: Redis 채널 구독 - {} (instanceId: {})", properties.redisChannel(), properties.instanceId());
        return container;
    }
}
