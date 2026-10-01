package com.asseterp.oms.common.websocket.dto;

/**
 * 메시지 분류. 클라이언트가 화면 영역(세션 처리, 알림함, 공지, 접속자 표)을 고르는 데 사용한다.
 */
public enum WsCategory {
    SESSION,
    NOTIFICATION,
    NOTICE,
    PRESENCE,
    SYSTEM
}
