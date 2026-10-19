package kr.co.kfs.asseterp.biz.ast.dto;

/** 거래코드 (Ast05_TrCodeModel) — 여부 열은 DB 문자열 'true'/'false' 그대로 */
public record TrCodeRes(Long trCodeId, Long companyId, String trCode, String trName, String rcvPayCode, String rcvPayName,
                        String trOccType, String trOccTypeName, String itemClassGroupCode,
                        String financeYn, String lockYn, String useYn, String note) {
}
