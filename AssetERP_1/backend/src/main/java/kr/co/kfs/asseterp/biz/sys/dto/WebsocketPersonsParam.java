package kr.co.kfs.asseterp.biz.sys.dto;

import java.util.List;

/** 접속 중인 사원 조회 조건. loginList = 지금 WebSocket에 접속한 사원 ID(AS-IS BroadcastWebsocket.getInfoList()) */
public record WebsocketPersonsParam(Long companyId, String searchText, List<Long> loginList, int offset, int limit) {
}
