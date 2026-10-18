package kr.co.kfs.asseterp.biz.ast.dto;

/** 자산상세 항목 저장 한 행 — detailId가 0 이하이거나 DB에 없으면 등록 */
public record AstDetailSaveReq(Long detailId, Long seq, String title, String tag, String useYn) {
}
