package kr.co.kfs.asseterp.oms.common.websocket;

import kr.co.kfs.asseterp.oms.common.websocket.dto.WsUser;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.WebSocketHandlerDecorator;

import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicBoolean;

/**
 * 이 인스턴스에 연결된 WebSocket 세션 목록. 서버가 세션을 강제로 닫으려면 WebSocketSession 참조가 필요하므로
 * WebSocket 핸들러를 감싸(decorate) 연결·종료 시점에 등록·제거한다. (STOMP simpSessionId = WebSocketSession id)
 */
@Slf4j
@Component
public class WsSessionRegistry {

    /**
     * @param closing 종료 처리가 시작되었는지 (멀티 로그인 이벤트와 주기 검사가 겹쳐도 한 번만 종료)
     */
    public record Entry(WebSocketSession session, WsUser user, AtomicBoolean closing) {

        public String sessionId() {
            return session.getId();
        }
    }

    private final Map<String, Entry> sessions = new ConcurrentHashMap<>();

    public WebSocketHandler decorate(WebSocketHandler handler) {
        return new WebSocketHandlerDecorator(handler) {
            @Override
            public void afterConnectionEstablished(WebSocketSession session) throws Exception {
                if (session.getAttributes().get(WsUser.ATTRIBUTE) instanceof WsUser user) {
                    sessions.put(session.getId(), new Entry(session, user, new AtomicBoolean(false)));
                    log.debug("WebSocket 세션 등록 - sessionId: {}, user: {}", session.getId(), user.username());
                }
                super.afterConnectionEstablished(session);
            }

            @Override
            public void afterConnectionClosed(WebSocketSession session, CloseStatus closeStatus) throws Exception {
                // STOMP 종료 처리(SessionDisconnectEvent 발행)가 끝난 뒤 제거해, 이벤트 리스너가 사용자 정보를 조회할 수 있게 한다
                try {
                    super.afterConnectionClosed(session, closeStatus);
                } finally {
                    sessions.remove(session.getId());
                }
            }
        };
    }

    public Entry get(String sessionId) {
        return sessions.get(sessionId);
    }

    public Collection<Entry> getAll() {
        return List.copyOf(sessions.values());
    }

    public List<Entry> findByUserId(Long userId) {
        return sessions.values().stream()
                .filter(entry -> Objects.equals(entry.user().userId(), userId))
                .toList();
    }

    public boolean contains(String sessionId) {
        return sessions.containsKey(sessionId);
    }
}
