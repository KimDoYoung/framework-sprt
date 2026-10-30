package kr.co.kfs.asseterp.biz.ast.dto;

import java.time.LocalDate;

/**
 * AS-IS ast.Ast06_Tr.selectByPayCode · selectById (금융상품 거래, W05 청약처리) — 그리드 열 + 편집창 값.
 * ast06_tr + ast08_tr_finance. 원본은 `select *`로 훨씬 많은 열을 읽지만 화면이 쓰는 것만 둔다
 */
public record TrFinanceRes(
        Long trId,
        LocalDate date,
        String trCode,
        String trName,
        Long corpId,
        String corpName,
        String corpAccountName,
        Long astClassTreeId,
        String astClassName,
        String classTreeName,
        String classTreeFullName,
        String curCode,
        Long trUnit,
        Double qty,
        Double price,
        Long trAmt,
        Long fee,
        Long amt,
        String lockUpPeriodCode,
        String lockUpPeriodName,
        LocalDate lockUpDate,
        LocalDate listDate,
        Long accountId,
        String accountName,
        Long trFinanceId,
        boolean settleMngYn,
        Long depositId,
        String depositName,
        String note,
        Long personId,
        String personName,
        Long journalId,
        Long apprId,
        String apprStatusCode,
        String apprCnt,
        Long dcrClassTreeId
) {
}
