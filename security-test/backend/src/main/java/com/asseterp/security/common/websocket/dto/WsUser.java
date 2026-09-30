package com.asseterp.security.common.websocket.dto;

import java.time.Instant;
import java.util.List;

/**
 * handshake 때 인증된 사용자 정보. WebSocket 세션 attributes에 저장되어 세션이 끝날 때까지 유지된다.
 * 소켓의 유효성은 JWT 만료가 아니라 Redis 활성 jti와의 일치 여부로 판단한다.
 */
public record WsUser(
        Long userId,
        String username,
        String name,
        String jti,
        List<String> roles,
        String clientIp,
        Instant connectedAt
) {
    /** WebSocket 세션 attributes 키 */
    public static final String ATTRIBUTE = "WS_USER";

    private static final String ROLE_ADMIN = "ROLE_ADMIN";

    public boolean isAdmin() {
        return roles != null && roles.contains(ROLE_ADMIN);
    }
}
