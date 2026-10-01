package kr.co.kfs.asseterp.oms.common.websocket;

import kr.co.kfs.asseterp.oms.biz.auth.dto.UserPrincipal;
import kr.co.kfs.asseterp.oms.common.log.MdcKeys;
import kr.co.kfs.asseterp.oms.common.websocket.dto.WsUser;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.MDC;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.HandshakeInterceptor;

import java.time.Instant;
import java.util.Map;

/**
 * handshake(HTTP GET /ws)는 Security 필터 체인에서 ACCESS_TOKEN 쿠키로 이미 인증되었다.
 * 인증된 사용자 정보를 WebSocket 세션 attributes에 옮겨 담아, 이후 STOMP 프레임 처리와 세션 재검증에 사용한다.
 */
@Slf4j
@Component
public class JwtHandshakeInterceptor implements HandshakeInterceptor {

    @Override
    public boolean beforeHandshake(ServerHttpRequest request, ServerHttpResponse response,
                                   WebSocketHandler wsHandler, Map<String, Object> attributes) {
        if (!(request.getPrincipal() instanceof Authentication authentication)
                || !(authentication.getPrincipal() instanceof UserPrincipal principal)) {
            log.warn("인증 정보 없는 WebSocket handshake 거부");
            response.setStatusCode(HttpStatus.UNAUTHORIZED);
            return false;
        }

        // handshake 요청 스레드에는 MdcLoggingFilter가 클라이언트 IP를 넣어 두었다 (프록시 설정 반영)
        String clientIp = MDC.get(MdcKeys.CLIENT_IP);
        if (clientIp == null && request.getRemoteAddress() != null) {
            clientIp = request.getRemoteAddress().getAddress().getHostAddress();
        }
        attributes.put(WsUser.ATTRIBUTE, new WsUser(
                principal.getUserId(),
                principal.getUsername(),
                principal.getName(),
                principal.getJti(),
                principal.getRoles(),
                clientIp,
                Instant.now()));
        return true;
    }

    @Override
    public void afterHandshake(ServerHttpRequest request, ServerHttpResponse response,
                               WebSocketHandler wsHandler, Exception exception) {
    }
}
