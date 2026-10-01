package com.asseterp.oms.common.websocket.dto;

/**
 * 메시지 전달 대상. Redis Pub/Sub으로 모든 인스턴스에 전달되고, 각 인스턴스는 자신에게 연결된 세션에만 보낸다.
 *
 * @param target      대상 종류
 * @param destination STOMP 목적지 (USER는 /user 이하 경로, 예: /queue/notifications)
 * @param username    USER 대상 로그인 아이디
 * @param userId      SESSION_CONTROL 대상 사용자
 * @param keepJti     SESSION_CONTROL에서 유지할 jti (null이면 해당 사용자의 모든 세션 종료)
 */
public record WsRoute(
        Target target,
        String destination,
        String username,
        Long userId,
        String keepJti
) {
    public enum Target {
        /** 특정 사용자의 모든 세션 */
        USER,
        /** 목적지를 구독한 모든 세션 (/topic/*) */
        ALL,
        /** 특정 사용자의 세션 중 keepJti가 아닌 세션에 메시지를 보낸 뒤 연결 종료 */
        SESSION_CONTROL
    }

    public static WsRoute user(String username, String destination) {
        return new WsRoute(Target.USER, destination, username, null, null);
    }

    public static WsRoute all(String destination) {
        return new WsRoute(Target.ALL, destination, null, null, null);
    }

    public static WsRoute sessionControl(Long userId, String keepJti) {
        return new WsRoute(Target.SESSION_CONTROL, null, null, userId, keepJti);
    }
}
