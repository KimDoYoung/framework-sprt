package com.asseterp.oms.common.websocket;

import com.asseterp.oms.biz.audit.dto.AuditEventType;
import com.asseterp.oms.biz.audit.dto.AuditResult;
import com.asseterp.oms.biz.audit.service.AuditLogService;
import com.asseterp.oms.common.config.properties.WebSocketProperties;
import com.asseterp.oms.common.websocket.dto.WsMessage;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessageType;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.TaskScheduler;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;

import java.io.IOException;
import java.time.Instant;
import java.util.Map;

/**
 * 이 인스턴스의 WebSocket 세션 하나에 종료 사유 메시지를 보낸 뒤 연결을 닫는다.
 * 메시지는 비동기(clientOutboundChannel)로 나가므로 바로 닫으면 유실될 수 있어 close-delay 뒤에 닫는다.
 * 클라이언트는 메시지를 받으면 스스로 연결을 끊으므로, 서버 종료는 응답하지 않는 클라이언트를 위한 보장 장치다.
 */
@Slf4j
@Component
public class WsSessionTerminator {

    /** 세션 종료 사유에 의한 서버 측 종료 (RFC 6455 사설 영역 4000~4999) */
    public static final int CLOSE_CODE_SESSION_TERMINATED = 4001;

    private final SimpMessagingTemplate messagingTemplate;
    private final TaskScheduler taskScheduler;
    private final AuditLogService auditLogService;
    private final WebSocketProperties properties;

    public WsSessionTerminator(SimpMessagingTemplate messagingTemplate,
                               @Qualifier(WebSocketConfig.TASK_SCHEDULER) TaskScheduler taskScheduler,
                               AuditLogService auditLogService,
                               WebSocketProperties properties) {
        this.messagingTemplate = messagingTemplate;
        this.taskScheduler = taskScheduler;
        this.auditLogService = auditLogService;
        this.properties = properties;
    }

    /**
     * @param reason 종료 사유 (close reason과 감사 로그에 기록)
     * @return 이번 호출로 종료를 시작했으면 true (이미 종료 중이면 false)
     */
    public boolean terminate(WsSessionRegistry.Entry entry, WsMessage<?> message, String reason) {
        if (!entry.closing().compareAndSet(false, true)) {
            return false;
        }
        String sessionId = entry.sessionId();
        messagingTemplate.convertAndSendToUser(entry.user().username(), WsDestinations.QUEUE_SESSION, message,
                sessionHeaders(sessionId));

        log.info("WebSocket 세션 강제 종료 - sessionId: {}, user: {}, reason: {}", sessionId, entry.user().username(), reason);
        auditLogService.record(AuditEventType.WS_FORCED_CLOSE, AuditResult.SUCCESS, entry.user().username(), sessionId,
                reason);

        taskScheduler.schedule(() -> {
            try {
                if (entry.session().isOpen()) {
                    entry.session().close(new CloseStatus(CLOSE_CODE_SESSION_TERMINATED, reason));
                }
            } catch (IOException e) {
                log.warn("WebSocket 세션 종료 실패 - sessionId: {}, cause: {}", sessionId, e.getMessage());
            }
        }, Instant.now().plus(properties.closeDelay()));
        return true;
    }

    /**
     * 사용자 목적지를 특정 세션 하나로 한정하는 헤더
     */
    private static Map<String, Object> sessionHeaders(String sessionId) {
        SimpMessageHeaderAccessor accessor = SimpMessageHeaderAccessor.create(SimpMessageType.MESSAGE);
        accessor.setSessionId(sessionId);
        accessor.setLeaveMutable(true);
        return accessor.getMessageHeaders();
    }
}
