package com.asseterp.security.common.websocket.dto;

/**
 * Redis Pub/Sub 채널로 오가는 전달 단위 (대상 + 메시지). 발행한 인스턴스를 로그에 남기기 위해 instanceId를 포함한다.
 */
public record WsEnvelope(String instanceId, WsRoute route, WsMessage<?> message) {
}
