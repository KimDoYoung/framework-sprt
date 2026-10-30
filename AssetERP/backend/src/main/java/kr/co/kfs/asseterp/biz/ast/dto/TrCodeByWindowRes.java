package kr.co.kfs.asseterp.biz.ast.dto;

/** AS-IS ast05_tr_code.selectByWindowClassName (Ast05_Lookup_TrCodeWindow) — 화면별 거래유형. astClassTreeId는 4대보험 등록이 새 거래에 넘긴다 */
public record TrCodeByWindowRes(Long trCodeId, Long companyId, String trCode, String trName, String rcvPayCode, String rcvPayName,
                                Long astClassTreeId, String note) {
}
