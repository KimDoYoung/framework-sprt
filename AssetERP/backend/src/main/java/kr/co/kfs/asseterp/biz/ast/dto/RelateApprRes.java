package kr.co.kfs.asseterp.biz.ast.dto;

/** 연관문서(고유자산) 한 건(Ast80_RelateApprModel) — 상신 문서 ID·상태 */
public record RelateApprRes(Long relateApprId, Long apprId, String statusCode, String statusName) {
}
