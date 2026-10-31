package kr.co.kfs.asseterp.biz.ics.dto;

/** 준수보고·부서장 준수확인서 상신 연결 만들기 (AS-IS ics.Ics32_RelateAppr.insert) — yyyymm = 'yyyy.MM', apprType 1(준수보고 A32, 기본)·2(부서장 준수확인서 A52) */
public record IcsComplianceReportRelateReq(String yyyymm, String cycleType, String apprType) {
}
