package kr.co.kfs.asseterp.common.websocket;

/**
 * STOMP 목적지. 클라이언트는 여기 정의된 목적지만 구독(SUBSCRIBE)할 수 있고, 전송(SEND)은 /app 이하만 허용한다.
 */
public final class WsDestinations {

    /** 클라이언트 → 서버 (@MessageMapping) */
    public static final String APP_PREFIX = "/app";
    /** 사용자 전용 목적지 prefix (/user/queue/** → 해당 사용자의 세션에만 전달) */
    public static final String USER_PREFIX = "/user";

    /** 세션 제어 (SESSION_TERMINATED) */
    public static final String QUEUE_SESSION = "/queue/session";
    /** 개인 알림 (NOTIFICATION, ECHO) */
    public static final String QUEUE_NOTIFICATIONS = "/queue/notifications";
    /** 전체 공지 (NOTICE) */
    public static final String TOPIC_NOTICE = "/topic/notice";
    /** 접속자 변경 (PRESENCE_CHANGED, 관리자 전용) */
    public static final String TOPIC_PRESENCE = "/topic/presence";

    private WsDestinations() {
    }
}
