package kr.co.kfs.asseterp.biz.ast.dto;

/** 거래코드 + 연결종목·연결문서분류 (Ast05_TrCodeModel 중 Ast05_Tab_TrCodeIntrinsic 그리드 열, EE11) — 여부 열은 DB 문자열 'true'/'false' 그대로 */
public record TrCodeIntrinsicRes(Long trCodeId, Long companyId, String trCode, String trName, String rcvPayCode, String rcvPayName,
                                 String trOccType, String trOccTypeName, Long astClassTreeId, String astClassTreeName,
                                 String itemClassGroupCode, Long dcrClassTreeId, String dcrClassTreeName,
                                 String financeYn, String lockYn, String useYn, String note) {
}
