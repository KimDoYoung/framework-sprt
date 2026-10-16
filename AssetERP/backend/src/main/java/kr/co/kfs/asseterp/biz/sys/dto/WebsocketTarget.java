package kr.co.kfs.asseterp.biz.sys.dto;

/** 알림·강제 로그아웃 대상 사원 (WebSocket 사용자 이름 = {회사코드}:{사번}) */
public record WebsocketTarget(Long personId, String korName, String empNo, String companyCode) {
}
