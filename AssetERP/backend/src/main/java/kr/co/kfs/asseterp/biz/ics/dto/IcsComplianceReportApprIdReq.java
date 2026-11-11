package kr.co.kfs.asseterp.biz.ics.dto;

/**
 * 준수보고 상신 문서 기록 (AS-IS ics.Ics32_RelateAppr.updateApprId).
 * #1311은 rdGroupId(상신 때 만든 출력 자료)·yyyy·cycleName을 같이 보내 RD 첨부 PDF "내부통제 준수보고(yyyy년 주기).pdf"를 붙인다(없으면 첨부 안 함)
 */
public record IcsComplianceReportApprIdReq(Long apprId, Long rdGroupId, String yyyy, String cycleName) {
}
