package kr.co.kfs.asseterp.biz.ast.dto;

import java.time.LocalDate;

/** AS-IS ast.Ast07_Settle.selectByTrId — 거래별 결제내역(Ast07_Grid_Settle 그리드 + 변경 창 값) */
public record SettleByTrRes(
        Long settleId,
        Long trId,
        LocalDate settleDate,
        Long settleAmt,
        Long amt,
        Long depositId,
        String depositName,
        String note,
        String trCode,
        Long journalId,
        /** 외화 결제(X08) — 외화결제금액·적용환율·외화 미수/미지급금액 */
        Double forSettleAmt,
        Double fxRate,
        Double forAmt
) {
}
