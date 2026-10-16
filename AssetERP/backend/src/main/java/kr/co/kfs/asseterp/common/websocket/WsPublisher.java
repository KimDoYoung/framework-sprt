package kr.co.kfs.asseterp.common.websocket;

import kr.co.kfs.asseterp.common.config.properties.WebSocketProperties;
import kr.co.kfs.asseterp.common.error.BusinessException;
import kr.co.kfs.asseterp.common.error.ErrorCode;
import kr.co.kfs.asseterp.common.websocket.dto.WsEnvelope;
import kr.co.kfs.asseterp.common.websocket.dto.WsMessage;
import kr.co.kfs.asseterp.common.websocket.dto.WsRoute;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataAccessException;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;

/**
 * 서버발 WebSocket 메시지의 단일 발행 창구. 로컬 브로커로 바로 보내지 않고 Redis 채널에 발행하며,
 * 발행한 인스턴스를 포함한 모든 인스턴스의 WsRedisSubscriber가 받아 자기 세션에 전달한다.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class WsPublisher {

    private final StringRedisTemplate redisTemplate;
    private final ObjectMapper objectMapper;
    private final WebSocketProperties properties;

    /**
     * @throws BusinessException Redis 장애 시 SESSION_STORE_UNAVAILABLE
     */
    public void publish(WsRoute route, WsMessage<?> message) {
        String json;
        try {
            json = objectMapper.writeValueAsString(new WsEnvelope(properties.instanceId(), route, message));
        } catch (JsonProcessingException e) {
            throw new IllegalStateException("WebSocket 메시지 직렬화 실패", e);
        }
        try {
            redisTemplate.convertAndSend(properties.redisChannel(), json);
        } catch (DataAccessException e) {
            log.error("WebSocket 메시지 발행 실패 (Redis) - type: {}, cause: {}", message.type(), e.getMessage());
            throw new BusinessException(ErrorCode.SESSION_STORE_UNAVAILABLE);
        }
        log.debug("WebSocket 메시지 발행 - route: {}, type: {}, id: {}", route.target(), message.type(), message.id());
    }
}
