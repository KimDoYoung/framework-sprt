package kr.co.kfs.asseterp.biz.ics.dto;

/** ics16_relate_appr·ics32_relate_appr의 연결 행 (연결 ID, 상신 문서 ID) */
public record IcsRelateApprRow(Long relateApprId, Long apprId) {
}
