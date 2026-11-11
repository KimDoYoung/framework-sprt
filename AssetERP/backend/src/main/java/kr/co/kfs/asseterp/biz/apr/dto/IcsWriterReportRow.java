package kr.co.kfs.asseterp.biz.apr.dto;

/** A53 본문 표의 한 줄 (AS-IS ics30_compliance.selectWriterReport — 준수항목명·준수결과·미준수 사유(" - 사유…")) */
public record IcsWriterReportRow(String complianceTypeName, String complianceResult, String reason) {
}
