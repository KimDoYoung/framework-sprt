package com.asseterp.security.common.websocket.dto;

import lombok.Getter;

/**
 * 메시지 유형. 유형마다 분류(category)와 payload 구조가 정해져 있다.
 */
@Getter
public enum WsMessageType {
    /** 세션 강제 종료 (payload: SessionTerminatedPayload) */
    SESSION_TERMINATED(WsCategory.SESSION),
    /** 사용자 개인 알림 (payload: NotificationPayload) */
    NOTIFICATION(WsCategory.NOTIFICATION),
    /** 전체 공지 (payload: 없음) */
    NOTICE(WsCategory.NOTICE),
    /** 접속자 변경 (payload: PresencePayload) */
    PRESENCE_CHANGED(WsCategory.PRESENCE),
    /** STOMP 처리 오류 (payload: ErrorPayload) */
    ERROR(WsCategory.SYSTEM),
    /** 양방향 통신 확인용 응답 (payload: 없음) */
    ECHO(WsCategory.SYSTEM);

    private final WsCategory category;

    WsMessageType(WsCategory category) {
        this.category = category;
    }
}
