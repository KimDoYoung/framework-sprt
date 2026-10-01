package kr.co.kfs.asseterp.oms.common.websocket;

import kr.co.kfs.asseterp.oms.biz.audit.dto.AuditEventType;
import kr.co.kfs.asseterp.oms.biz.audit.service.AuditLogService;
import kr.co.kfs.asseterp.oms.common.config.properties.WebSocketProperties;
import kr.co.kfs.asseterp.oms.common.websocket.dto.WsLevel;
import kr.co.kfs.asseterp.oms.common.websocket.dto.WsMessage;
import kr.co.kfs.asseterp.oms.common.websocket.dto.WsMessageType;
import kr.co.kfs.asseterp.oms.common.websocket.dto.WsUser;
import kr.co.kfs.asseterp.oms.support.TestProperties;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.TaskScheduler;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.WebSocketSession;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.concurrent.atomic.AtomicBoolean;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

class WsSessionTerminatorTest {

    private final SimpMessagingTemplate messagingTemplate = mock(SimpMessagingTemplate.class);
    private final TaskScheduler taskScheduler = mock(TaskScheduler.class);
    private final AuditLogService auditLogService = mock(AuditLogService.class);
    private final WsSessionTerminator terminator = new WsSessionTerminator(messagingTemplate, taskScheduler,
            auditLogService, TestProperties.bind("asseterp.ws", WebSocketProperties.class));

    @Test
    @SuppressWarnings("unchecked")
    void 해당_세션에만_메시지를_보내고_지연_후_닫는다_중복_호출은_무시한다() throws Exception {
        WebSocketSession session = mock(WebSocketSession.class);
        when(session.getId()).thenReturn("s1");
        when(session.isOpen()).thenReturn(true);
        WsUser user = new WsUser(2L, "user1", "사용자", "jti-1", List.of("ROLE_USER"), null, Instant.now());
        WsSessionRegistry.Entry entry = new WsSessionRegistry.Entry(session, user, new AtomicBoolean(false));
        WsMessage<Void> message = WsMessage.of(WsMessageType.SESSION_TERMINATED, WsLevel.ERROR, "t", "m", null, null);

        assertThat(terminator.terminate(entry, message, "MULTI_LOGIN")).isTrue();
        assertThat(terminator.terminate(entry, message, "EXPIRED")).isFalse();

        ArgumentCaptor<Map<String, Object>> headers = ArgumentCaptor.forClass(Map.class);
        verify(messagingTemplate).convertAndSendToUser(eq("user1"), eq(WsDestinations.QUEUE_SESSION), eq(message),
                headers.capture());
        assertThat(headers.getValue().get(SimpMessageHeaderAccessor.SESSION_ID_HEADER)).isEqualTo("s1");
        verify(auditLogService).record(eq(AuditEventType.WS_FORCED_CLOSE), any(), eq("user1"), eq("s1"), eq("MULTI_LOGIN"));

        ArgumentCaptor<Runnable> closeTask = ArgumentCaptor.forClass(Runnable.class);
        verify(taskScheduler).schedule(closeTask.capture(), any(Instant.class));
        closeTask.getValue().run();
        verify(session).close(argThat((CloseStatus status) ->
                status.getCode() == WsSessionTerminator.CLOSE_CODE_SESSION_TERMINATED));
    }
}
