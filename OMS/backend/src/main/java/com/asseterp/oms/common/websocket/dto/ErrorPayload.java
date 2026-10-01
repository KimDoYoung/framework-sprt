package com.asseterp.oms.common.websocket.dto;

/**
 * ERROR 메시지 payload
 *
 * @param code ErrorCode 이름 (예: WS_DESTINATION_DENIED, MULTI_LOGIN_DETECTED)
 */
public record ErrorPayload(String code) {
}
