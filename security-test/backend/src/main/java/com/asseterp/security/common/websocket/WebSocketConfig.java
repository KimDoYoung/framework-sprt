package com.asseterp.security.common.websocket;

import com.asseterp.security.common.config.properties.CorsProperties;
import com.asseterp.security.common.config.properties.WebSocketProperties;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.scheduling.concurrent.ThreadPoolTaskScheduler;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketTransportRegistration;

/**
 * STOMP over WebSocket 설정 (docs/websocket-설계.md).
 * <ul>
 *   <li>엔드포인트: {ctx}/ws, native WebSocket만 사용 (SockJS 미사용)</li>
 *   <li>Origin 검사: 쿠키로 인증하므로 교차 사이트 WebSocket 하이재킹(CSWSH)을 막기 위해 CORS 허용 Origin만 허용</li>
 *   <li>브로커: 인스턴스별 SimpleBroker. 인스턴스 간 전달은 Redis Pub/Sub(WsPublisher/WsRedisSubscriber)</li>
 * </ul>
 */
@Configuration
@EnableWebSocketMessageBroker
@RequiredArgsConstructor
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    /** heartbeat, 세션 재검증, 지연 종료에 쓰는 스케줄러 */
    public static final String TASK_SCHEDULER = "wsTaskScheduler";

    private final WebSocketProperties properties;
    private final CorsProperties corsProperties;
    private final JwtHandshakeInterceptor handshakeInterceptor;
    private final StompAuthChannelInterceptor channelInterceptor;
    private final StompErrorHandler errorHandler;
    private final WsSessionRegistry sessionRegistry;

    @Bean(TASK_SCHEDULER)
    public ThreadPoolTaskScheduler wsTaskScheduler() {
        ThreadPoolTaskScheduler scheduler = new ThreadPoolTaskScheduler();
        scheduler.setPoolSize(2);
        scheduler.setThreadNamePrefix("ws-sched-");
        return scheduler;
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint(properties.endpoint())
                .setAllowedOriginPatterns(corsProperties.allowedOrigins().toArray(String[]::new))
                .addInterceptors(handshakeInterceptor);
        registry.setErrorHandler(errorHandler);
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        long heartbeat = properties.heartbeat().toMillis();
        registry.setApplicationDestinationPrefixes(WsDestinations.APP_PREFIX);
        registry.setUserDestinationPrefix(WsDestinations.USER_PREFIX);
        registry.enableSimpleBroker("/topic", "/queue")
                .setHeartbeatValue(new long[]{heartbeat, heartbeat})
                .setTaskScheduler(wsTaskScheduler());
    }

    @Override
    public void configureClientInboundChannel(ChannelRegistration registration) {
        registration.interceptors(channelInterceptor);
    }

    @Override
    public void configureWebSocketTransport(WebSocketTransportRegistration registration) {
        registration.addDecoratorFactory(sessionRegistry::decorate);
    }
}
