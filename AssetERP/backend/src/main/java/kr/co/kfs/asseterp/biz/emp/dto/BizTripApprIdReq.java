package kr.co.kfs.asseterp.biz.emp.dto;

/** Y05 결재문서 ID 기록 (AS-IS Emp53_BizTrip.update — result=true면 결과보고서 ID) */
public record BizTripApprIdReq(Long apprId, boolean result) {
}
