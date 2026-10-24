package kr.co.kfs.asseterp.biz.tdm.dto;

/**
 * 책무구조도 제출 첨부 목록 한 행 (AS-IS tdm36_role_report.getAttachList → Tdm36_RoleReportModel, N14).
 * rdCode = 출력 리포트 코드(MK_…), rdCode2 = 책무기술서(ROLE_DESC)·책무체계도(ROLE_DIGM) 구분,
 * roleReportId = 책무기술서·책무체계도 행에서는 그 문서의 ID(tdm31/tdm32), relateApprStatusCode = 연결 문서의 결재상태('00' 없음)
 */
public record RoleReportAttachRes(Long roleReportId, Integer seq, Integer subSeq, String rptTitle, String rptSubTitle,
                                  String rdCode, String rdCode2, Long relateFileId, Long relateApprId, String relateApprStatusCode) {
}
