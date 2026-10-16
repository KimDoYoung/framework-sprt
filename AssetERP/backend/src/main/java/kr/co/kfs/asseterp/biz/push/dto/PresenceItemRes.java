package kr.co.kfs.asseterp.biz.push.dto;

import java.time.Instant;

/**
 * 접속자 현황 항목 (WebSocket 세션 1개). Redis HASH(asseterp.ws.presence-key)에 JSON으로 저장된다.
 */
public record PresenceItemRes(
        String sessionId,
        Long userId,
        String username,
        String name,
        String instanceId,
        String clientIp,
        Instant connectedAt
) {
}
