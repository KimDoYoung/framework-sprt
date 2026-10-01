package kr.co.kfs.asseterp.oms.biz.push.service;

import kr.co.kfs.asseterp.oms.biz.audit.dto.AuditEventType;
import kr.co.kfs.asseterp.oms.biz.audit.dto.AuditResult;
import kr.co.kfs.asseterp.oms.biz.audit.service.AuditLogService;
import kr.co.kfs.asseterp.oms.biz.push.dto.PresenceItemRes;
import kr.co.kfs.asseterp.oms.biz.push.dto.PresencePayload;
import kr.co.kfs.asseterp.oms.common.config.properties.WebSocketProperties;
import kr.co.kfs.asseterp.oms.common.error.BusinessException;
import kr.co.kfs.asseterp.oms.common.error.ErrorCode;
import kr.co.kfs.asseterp.oms.common.websocket.WsDestinations;
import kr.co.kfs.asseterp.oms.common.websocket.WsMdc;
import kr.co.kfs.asseterp.oms.common.websocket.WsPublisher;
import kr.co.kfs.asseterp.oms.common.websocket.WsSessionRegistry;
import kr.co.kfs.asseterp.oms.common.websocket.dto.WsLevel;
import kr.co.kfs.asseterp.oms.common.websocket.dto.WsMessage;
import kr.co.kfs.asseterp.oms.common.websocket.dto.WsMessageType;
import kr.co.kfs.asseterp.oms.common.websocket.dto.WsRoute;
import kr.co.kfs.asseterp.oms.common.websocket.dto.WsSender;
import kr.co.kfs.asseterp.oms.common.websocket.dto.WsUser;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.MDC;
import org.springframework.context.event.ContextClosedEvent;
import org.springframework.context.event.EventListener;
import org.springframework.dao.DataAccessException;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Service;
import org.springframework.web.socket.messaging.SessionConnectedEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 접속자 현황(presence). 모든 인스턴스의 WebSocket 세션을 Redis HASH 하나에 모은다.
 * <ul>
 *   <li>field = {instanceId}:{sessionId}, value = PresenceItemRes JSON</li>
 *   <li>인스턴스 생존 키({instance-key-prefix}{instanceId}, TTL)를 주기적으로 갱신하고,
 *       조회 시 생존 키가 없는 인스턴스의 항목은 제외·삭제한다 (비정상 종료 대비).</li>
 *   <li>연결·종료 때 /topic/presence로 PRESENCE_CHANGED를 발행한다 (관리자 화면 실시간 갱신).</li>
 * </ul>
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class PresenceService {

    private final StringRedisTemplate redisTemplate;
    private final ObjectMapper objectMapper;
    private final WebSocketProperties properties;
    private final WsSessionRegistry sessionRegistry;
    private final WsPublisher wsPublisher;
    private final AuditLogService auditLogService;

    @EventListener
    public void onConnected(SessionConnectedEvent event) {
        String sessionId = SimpMessageHeaderAccessor.getSessionId(event.getMessage().getHeaders());
        WsSessionRegistry.Entry entry = sessionId != null ? sessionRegistry.get(sessionId) : null;
        if (entry == null) {
            return;
        }
        WsMdc.put(entry.user(), null);
        try {
            PresenceItemRes item = toItem(sessionId, entry.user());
            redisTemplate.opsForHash().put(properties.presenceKey(), fieldOf(sessionId), toJson(item));
            log.info("WebSocket 연결 - sessionId: {}, instanceId: {}", sessionId, properties.instanceId());
            auditLogService.record(AuditEventType.WS_CONNECT, AuditResult.SUCCESS, item.username(), sessionId,
                    "instance=" + properties.instanceId());
            publishChange(PresencePayload.Event.JOIN, item);
        } catch (RuntimeException e) {
            log.warn("접속자 등록 실패 - sessionId: {}, cause: {}", sessionId, e.getMessage());
        } finally {
            MDC.clear();
        }
    }

    /**
     * 클라이언트 종료, 네트워크 단절, 서버 강제 종료 모두 이 이벤트로 온다 (세션 레지스트리에는 아직 남아 있음).
     */
    @EventListener
    public void onDisconnected(SessionDisconnectEvent event) {
        String sessionId = event.getSessionId();
        WsSessionRegistry.Entry entry = sessionRegistry.get(sessionId);
        if (entry == null) {
            return;
        }
        WsMdc.put(entry.user(), null);
        try {
            Long removed = redisTemplate.opsForHash().delete(properties.presenceKey(), fieldOf(sessionId));
            if (removed == null || removed == 0) {
                return; // 이미 처리됨 (종료 이벤트 중복)
            }
            log.info("WebSocket 종료 - sessionId: {}, closeStatus: {}", sessionId, event.getCloseStatus());
            auditLogService.record(AuditEventType.WS_DISCONNECT, AuditResult.SUCCESS, entry.user().username(), sessionId,
                    "closeStatus=" + event.getCloseStatus().getCode());
            publishChange(PresencePayload.Event.LEAVE, toItem(sessionId, entry.user()));
        } catch (RuntimeException e) {
            log.warn("접속자 해제 실패 - sessionId: {}, cause: {}", sessionId, e.getMessage());
        } finally {
            MDC.clear();
        }
    }

    /**
     * 전체 인스턴스의 접속자 목록 (연결 시각 순)
     */
    public List<PresenceItemRes> searchPresence() {
        try {
            Map<Object, Object> entries = redisTemplate.opsForHash().entries(properties.presenceKey());
            Map<String, Boolean> aliveByInstance = new HashMap<>();
            List<PresenceItemRes> items = new ArrayList<>();
            List<Object> deadFields = new ArrayList<>();
            for (Map.Entry<Object, Object> e : entries.entrySet()) {
                PresenceItemRes item = fromJson((String) e.getValue());
                boolean alive = item != null && aliveByInstance.computeIfAbsent(item.instanceId(),
                        id -> Boolean.TRUE.equals(redisTemplate.hasKey(properties.instanceKeyPrefix() + id)));
                if (alive) {
                    items.add(item);
                } else {
                    deadFields.add(e.getKey());
                }
            }
            if (!deadFields.isEmpty()) {
                redisTemplate.opsForHash().delete(properties.presenceKey(), deadFields.toArray());
                log.info("종료된 인스턴스의 접속자 항목 정리 - {}건", deadFields.size());
            }
            items.sort(Comparator.comparing(PresenceItemRes::connectedAt));
            return items;
        } catch (DataAccessException e) {
            throw new BusinessException(ErrorCode.SESSION_STORE_UNAVAILABLE);
        }
    }

    /**
     * 인스턴스 생존 키 갱신 + 이 인스턴스 항목 중 실제 연결이 없는 것 정리 (WsSessionSweeper가 주기 호출)
     */
    public void heartbeat() {
        redisTemplate.opsForValue().set(instanceKey(), String.valueOf(System.currentTimeMillis()), properties.instanceTtl());

        String prefix = properties.instanceId() + ":";
        List<Object> orphans = redisTemplate.opsForHash().keys(properties.presenceKey()).stream()
                .map(String::valueOf)
                .filter(field -> field.startsWith(prefix))
                .filter(field -> !sessionRegistry.contains(field.substring(prefix.length())))
                .map(field -> (Object) field)
                .toList();
        if (!orphans.isEmpty()) {
            redisTemplate.opsForHash().delete(properties.presenceKey(), orphans.toArray());
            log.info("연결이 없는 접속자 항목 정리 - {}건", orphans.size());
        }
    }

    /**
     * 정상 종료 시 이 인스턴스의 항목과 생존 키 삭제.
     * @PreDestroy는 Redis 연결(Lifecycle)이 먼저 멈춘 뒤 호출되므로, 그보다 앞서 오는 ContextClosedEvent에서 처리한다.
     */
    @EventListener(ContextClosedEvent.class)
    public void cleanup() {
        try {
            String prefix = properties.instanceId() + ":";
            Object[] own = redisTemplate.opsForHash().keys(properties.presenceKey()).stream()
                    .map(String::valueOf)
                    .filter(field -> field.startsWith(prefix))
                    .toArray();
            if (own.length > 0) {
                redisTemplate.opsForHash().delete(properties.presenceKey(), own);
            }
            redisTemplate.delete(instanceKey());
        } catch (RuntimeException e) {
            log.warn("접속자 항목 정리 실패 (생존 키 TTL 만료 후 조회 시 정리됨) - cause: {}", e.getMessage());
        }
    }

    private void publishChange(PresencePayload.Event event, PresenceItemRes item) {
        int count = searchPresence().size();
        String text = item.name() + "(" + item.username() + ") " + (event == PresencePayload.Event.JOIN ? "접속" : "종료");
        wsPublisher.publish(WsRoute.all(WsDestinations.TOPIC_PRESENCE),
                WsMessage.of(WsMessageType.PRESENCE_CHANGED, WsLevel.INFO, "접속자 변경", text,
                        new PresencePayload(event, item, count), WsSender.SYSTEM));
    }

    private PresenceItemRes toItem(String sessionId, WsUser user) {
        return new PresenceItemRes(sessionId, user.userId(), user.username(), user.name(), properties.instanceId(),
                user.clientIp(), user.connectedAt());
    }

    private String fieldOf(String sessionId) {
        return properties.instanceId() + ":" + sessionId;
    }

    private String instanceKey() {
        return properties.instanceKeyPrefix() + properties.instanceId();
    }

    private String toJson(PresenceItemRes item) {
        try {
            return objectMapper.writeValueAsString(item);
        } catch (JsonProcessingException e) {
            throw new IllegalStateException(e);
        }
    }

    private PresenceItemRes fromJson(String json) {
        try {
            return objectMapper.readValue(json, PresenceItemRes.class);
        } catch (JsonProcessingException e) {
            log.warn("접속자 항목 해석 실패: {}", e.getMessage());
            return null;
        }
    }
}
