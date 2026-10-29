package kr.co.kfs.asseterp.biz.car.dto;

/** 공용차량 운행변경(관리자) 확정·확정취소 — 화면에 보이는 조건(infoId·searchText)의 행 전부 */
public record CarPublicAdminFixReq(Long infoId, String stdMonth, String searchText, Boolean fixYn) {
}
