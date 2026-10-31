package kr.co.kfs.asseterp.biz.apr.dto;

/** 결재선 한 줄 (apr04_appr_step, V03) — apprStepId가 없으면 서버가 새로 발급한다 */
public record AprApprSaveStepReq(Long apprStepId, String stepTypeCode, String seq, String stepStatusCode, Long stepEmpId, String lockYn, Long addEmpId) {
}
