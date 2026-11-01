package kr.co.kfs.asseterp.biz.ast.dto;

import java.time.LocalDate;

/** AS-IS Ast06_Lookup_TrDeposit.preUpdate → ast.Ast06_Tr.update — trId가 없으면 새 거래. 외화금액·환율·장부금액은 서버가 정한다. 외화 계좌이체(X10)는 curCode·fxRate·forAmt를 화면이 보내며(curCode가 있으면 외화), 장부금액은 분개 전 sell-book-amt가 정한다 */
public record TrDepositSaveReq(
        Long trId,
        LocalDate date,
        Long astClassTreeId,
        Long corpId,
        Long depositId,
        Long amt,
        Long fee,
        String note,
        String curCode,
        Double fxRate,
        Double forAmt
) {
}
