package kr.co.kfs.asseterp.oms.biz.audit.service;

import kr.co.kfs.asseterp.oms.biz.user.mapper.AccountMapper;
import kr.co.kfs.asseterp.oms.common.config.properties.AuditProperties;
import kr.co.kfs.asseterp.oms.common.config.properties.AuthProperties;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.listener.ChannelTopic;
import org.springframework.data.redis.listener.RedisMessageListenerContainer;

/**
 * 세션 만료 감사용 Redis 키 만료 이벤트 구독 (asseterp.audit.session-expiry.enabled=true).
 * Redis 서버에 notify-keyspace-events Ex(키 이벤트 + 만료)가 설정되어 있어야 이벤트가 발행된다.
 * 운영 Redis는 CONFIG 명령이 막혀 있을 수 있으므로 앱이 설정을 바꾸지 않고, 서버 기동 옵션으로 설정한다.
 */
@Slf4j
@Configuration
@ConditionalOnProperty(prefix = "asseterp.audit.session-expiry", name = "enabled", havingValue = "true")
public class SessionExpiryAuditConfig {

    @Bean
    public SessionExpiryAuditListener sessionExpiryAuditListener(AuthProperties authProperties,
                                                                 AuditProperties auditProperties,
                                                                 StringRedisTemplate redisTemplate,
                                                                 AccountMapper accountMapper,
                                                                 AuditLogService auditLogService) {
        return new SessionExpiryAuditListener(authProperties, auditProperties.sessionExpiry(),
                redisTemplate, accountMapper, auditLogService);
    }

    @Bean
    public RedisMessageListenerContainer sessionExpiryListenerContainer(RedisConnectionFactory connectionFactory,
                                                                        SessionExpiryAuditListener listener,
                                                                        @Value("${spring.data.redis.database:0}") int database) {
        String channel = "__keyevent@" + database + "__:expired";
        RedisMessageListenerContainer container = new RedisMessageListenerContainer();
        container.setConnectionFactory(connectionFactory);
        container.addMessageListener(listener, new ChannelTopic(channel));
        log.info("세션 만료 감사: Redis 채널 구독 - {} (Redis에 notify-keyspace-events Ex 설정 필요)", channel);
        return container;
    }
}
