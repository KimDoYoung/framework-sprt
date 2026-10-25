package kr.co.kfs.asseterp.biz.tdm.dto;

/** 제출·제출취소 요청 — actionType P(제출)·C(제출취소). 대상은 로그인 사용자의 승인 행 전부 (AS-IS는 화면 그리드 전체) */
public record CheckApprSubmitReq(String checkYm, Long roleId, String actionType) {
}
