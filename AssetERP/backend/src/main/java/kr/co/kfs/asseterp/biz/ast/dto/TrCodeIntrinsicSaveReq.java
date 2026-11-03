package kr.co.kfs.asseterp.biz.ast.dto;

/** 고유자산 거래코드 저장 행 — trCodeId가 없거나 0 이하면 신규 */
public record TrCodeIntrinsicSaveReq(Long trCodeId, String trCode, String trName, String rcvPayCode, String trOccType,
                                     Long astClassTreeId, String itemClassGroupCode, Long dcrClassTreeId,
                                     String financeYn, String lockYn, String useYn, String note) {
}
