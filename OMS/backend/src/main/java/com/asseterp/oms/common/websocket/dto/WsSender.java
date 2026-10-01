package com.asseterp.oms.common.websocket.dto;

/**
 * 메시지 발신자
 *
 * @param username 로그인 아이디 (시스템 발신이면 "SYSTEM")
 * @param name     표시 이름
 */
public record WsSender(String username, String name) {

    public static final WsSender SYSTEM = new WsSender("SYSTEM", "시스템");
}
