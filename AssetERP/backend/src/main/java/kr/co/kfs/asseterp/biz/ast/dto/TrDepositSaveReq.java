package kr.co.kfs.asseterp.biz.ast.dto;

import java.time.LocalDate;

/** AS-IS Ast06_Lookup_TrDeposit.preUpdate → ast.Ast06_Tr.update — trId가 없으면 새 거래. 외화금액·환율·장부금액은 서버가 정한다 */
public record TrDepositSaveReq(
        Long trId,
        LocalDate date,
        Long astClassTreeId,
        Long corpId,
        Long depositId,
        Long amt,
        Long fee,
        String note
) {
}
