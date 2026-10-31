package kr.co.kfs.asseterp.biz.apr.dto;

/** A52 본문 표의 한 줄 (AS-IS Ics30_ComplianceModel 중 이름·부서·직위·준수여부, V28) */
public record IcsWriterLinkRow(Long personId, String personName, String orgName, String posName, String complianceResult) {
}
