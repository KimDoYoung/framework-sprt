package kr.co.kfs.asseterp.biz.ast.dto;

/** 일괄 결제등록 한 행 (위 그리드의 Ast06_TrModel 중 서버가 읽는 속성) */
public record SettleMultiRowReq(Long trId, String trCode, String rcvPayCode, Double accruedAmt, String note) {
}
