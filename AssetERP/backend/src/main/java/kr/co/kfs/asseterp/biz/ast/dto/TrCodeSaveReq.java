package kr.co.kfs.asseterp.biz.ast.dto;

/** 거래코드 저장 행 — trCodeId가 없거나 0 이하면 신규 */
public record TrCodeSaveReq(Long trCodeId, String trCode, String trName, String rcvPayCode, String trOccType, String itemClassGroupCode,
                            String financeYn, String lockYn, String useYn, String note) {
}
