package kr.co.kfs.asseterp.biz.att.dto;

/** 저장·확정 대상 한 행 (AS-IS updateInfo의 updateList 원소) */
public record AttOvertimeReqRow(Long overtimeReqId, String paymentTypeCode, String confirmYn, String changeReason) {
}
