package kr.co.kfs.asseterp.biz.ics.dto;

/** 보고 대상 재직 사원 (AS-IS emp03_trans.selectInOffice) */
public record IcsComplianceReportEmp(Long personId, String personName, String orgName) {
}
