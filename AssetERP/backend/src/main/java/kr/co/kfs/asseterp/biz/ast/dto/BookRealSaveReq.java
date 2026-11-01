package kr.co.kfs.asseterp.biz.ast.dto;

/** Ast12_Lookup_RealDeposit [저장] — 고친 행. bookRealId는 조회 때 받은 값(이미 있는 행이면 UPDATE, 없으면 그 ID로 INSERT) */
public record BookRealSaveReq(
        Long bookRealId,
        Long astClassTreeId,
        String curCode,
        Long realAmt,
        Double realForAmt,
        String note
) {
}
