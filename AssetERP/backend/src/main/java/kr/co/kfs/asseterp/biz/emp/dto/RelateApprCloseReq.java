package kr.co.kfs.asseterp.biz.emp.dto;

/** [마감]·[취소] (AS-IS Emp51_RelateAppr.updateCloseYn) — 기준년월 전체를 마감/마감취소 */
public record RelateApprCloseReq(String yyyymm, boolean closeYn) {
}
