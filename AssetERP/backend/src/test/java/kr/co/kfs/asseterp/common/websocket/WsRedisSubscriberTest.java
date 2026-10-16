package kr.co.kfs.asseterp.common.websocket;

import kr.co.kfs.asseterp.common.websocket.dto.WsEnvelope;
import kr.co.kfs.asseterp.common.websocket.dto.WsLevel;
import kr.co.kfs.asseterp.common.websocket.dto.WsMessage;
import kr.co.kfs.asseterp.common.websocket.dto.WsMessageType;
import kr.co.kfs.asseterp.common.websocket.dto.WsRoute;
import kr.co.kfs.asseterp.common.websocket.dto.WsUser;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.databind.json.JsonMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.data.redis.connection.DefaultMessage;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.WebSocketSession;

import java.time.Instant;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

class WsRedisSubscriberTest {

    private final ObjectMapper objectMapper = JsonMapper.builder()
            .findAndAddModules()
            .disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS)
            .build();
    private final SimpMessagingTemplate messagingTemplate = mock(SimpMessagingTemplate.class);
    private final WsSessionTerminator terminator = mock(WsSessionTerminator.class);
    private final WsSessionRegistry registry = new WsSessionRegistry();
    private final WsRedisSubscriber subscriber =
            new WsRedisSubscriber(objectMapper, messagingTemplate, registry, terminator);

    @BeforeEach
    void setUp() throws Exception {
        WebSocketHandler handler = registry.decorate(mock(WebSocketHandler.class));
        handler.afterConnectionEstablished(session("s-old", 2L, "jti-old"));
        handler.afterConnectionEstablished(session("s-new", 2L, "jti-new"));
        handler.afterConnectionEstablished(session("s-other", 3L, "jti-x"));
    }

    private static WebSocketSession session(String id, Long userId, String jti) {
        WebSocketSession session = mock(WebSocketSession.class);
        Map<String, Object> attributes = new HashMap<>();
        attributes.put(WsUser.ATTRIBUTE, new WsUser(userId, "user" + userId, "사용자", jti, List.of("ROLE_USER"),
                "127.0.0.1", Instant.now()));
        when(session.getId()).thenReturn(id);
        when(session.getAttributes()).thenReturn(attributes);
        return session;
    }

    private void receive(WsRoute route) throws Exception {
        WsMessage<Map<String, String>> message = WsMessage.of(WsMessageType.SESSION_TERMINATED, WsLevel.ERROR,
                "동시 접속 차단", "본문", Map.of("reason", "MULTI_LOGIN"), null);
        byte[] body = objectMapper.writeValueAsBytes(new WsEnvelope("inst-1", route, message));
        subscriber.onMessage(new DefaultMessage("ch".getBytes(), body), null);
    }

    @Test
    void 멀티_로그인은_새_jti를_제외한_같은_사용자_세션만_종료한다() throws Exception {
        receive(WsRoute.sessionControl(2L, "jti-new"));

        verify(terminator).terminate(argThat(e -> e.sessionId().equals("s-old")), any(), eq("MULTI_LOGIN"));
        verifyNoMoreInteractions(terminator);
    }

    @Test
    void 유지할_jti가_없으면_사용자의_모든_세션을_종료한다() throws Exception {
        receive(WsRoute.sessionControl(2L, null));

        verify(terminator, times(2)).terminate(argThat(e -> e.user().userId().equals(2L)), any(), any());
        verifyNoMoreInteractions(terminator);
    }

    @Test
    void 사용자_대상과_전체_대상은_로컬_브로커로_전달한다() throws Exception {
        receive(WsRoute.user("user2", WsDestinations.QUEUE_NOTIFICATIONS));
        receive(WsRoute.all(WsDestinations.TOPIC_NOTICE));

        verify(messagingTemplate).convertAndSendToUser(eq("user2"), eq(WsDestinations.QUEUE_NOTIFICATIONS), any(WsMessage.class));
        verify(messagingTemplate).convertAndSend(eq(WsDestinations.TOPIC_NOTICE), any(WsMessage.class));
        verifyNoInteractions(terminator);
    }
}
