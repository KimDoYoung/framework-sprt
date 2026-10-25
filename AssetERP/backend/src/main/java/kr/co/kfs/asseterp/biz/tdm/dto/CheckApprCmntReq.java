package kr.co.kfs.asseterp.biz.tdm.dto;

/** 종합의견 처리 요청 — actionType A(승인/등록)·R(반려)·C(취소)·U(저장). 처리 구분이 정해진 값만 */
public record CheckApprCmntReq(String actionType, String checkYm, String apprCmnt, String reportCmnt) {
}
