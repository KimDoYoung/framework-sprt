package com.asseterp.oms.common.websocket;

import com.asseterp.oms.common.websocket.dto.WsEnvelope;
import com.asseterp.oms.common.websocket.dto.WsMessage;
import com.asseterp.oms.common.websocket.dto.WsRoute;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.MDC;
import org.springframework.data.redis.connection.Message;
import org.springframework.data.redis.connection.MessageListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.Objects;

/**
 * Redis 채널(asseterp.ws.redis-channel)에서 받은 메시지를 이 인스턴스에 연결된 세션에 전달한다.
 * 메시지의 traceId를 MDC에 복원해, 발행한 요청(다른 인스턴스일 수도 있음)과 같은 추적ID로 로그를 남긴다.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class WsRedisSubscriber implements MessageListener {

    private final ObjectMapper objectMapper;
    private final SimpMessagingTemplate messagingTemplate;
    private final WsSessionRegistry sessionRegistry;
    private final WsSessionTerminator sessionTerminator;

    @Override
    public void onMessage(Message message, byte[] pattern) {
        try {
            WsEnvelope envelope = objectMapper.readValue(message.getBody(), WsEnvelope.class);
            WsMdc.put(null, envelope.message().traceId());
            deliver(envelope.route(), envelope.message(), envelope.instanceId());
        } catch (Exception e) {
            // 리스너 스레드가 죽지 않도록 예외를 삼키고 기록만 남긴다
            log.error("WebSocket 메시지 전달 실패 - cause: {}", e.getMessage(), e);
        } finally {
            MDC.clear();
        }
    }

    private void deliver(WsRoute route, WsMessage<?> message, String fromInstance) {
        log.debug("WebSocket 메시지 수신 - from: {}, route: {}, type: {}, id: {}",
                fromInstance, route.target(), message.type(), message.id());
        switch (route.target()) {
            case USER -> messagingTemplate.convertAndSendToUser(route.username(), route.destination(), message);
            case ALL -> messagingTemplate.convertAndSend(route.destination(), message);
            case SESSION_CONTROL -> sessionRegistry.findByUserId(route.userId()).stream()
                    .filter(entry -> route.keepJti() == null || !Objects.equals(entry.user().jti(), route.keepJti()))
                    .forEach(entry -> sessionTerminator.terminate(entry, message, reasonOf(message)));
        }
    }

    /**
     * 감사 로그·close reason용 종료 사유 (SESSION_TERMINATED payload의 reason, 없으면 제목)
     */
    private static String reasonOf(WsMessage<?> message) {
        if (message.payload() instanceof Map<?, ?> payload && payload.get("reason") != null) {
            return String.valueOf(payload.get("reason"));
        }
        return message.title();
    }
}
