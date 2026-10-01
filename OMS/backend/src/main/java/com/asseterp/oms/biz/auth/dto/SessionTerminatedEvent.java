package com.asseterp.oms.biz.auth.dto;

/**
 * 세션 종료 이벤트 (ApplicationEvent). 인증 로직은 WebSocket을 알지 못하고 이 이벤트만 발행하며,
 * push 도메인(PushService)이 받아 해당 사용자의 WebSocket 세션에 즉시 알리고 연결을 끊는다.
 *
 * @param userId  대상 사용자
 * @param keepJti 유지할 세션의 jti (새 로그인의 jti). null이면 사용자의 모든 세션 종료
 * @param reason  종료 사유
 */
public record SessionTerminatedEvent(Long userId, String keepJti, SessionTerminateReason reason) {
}
