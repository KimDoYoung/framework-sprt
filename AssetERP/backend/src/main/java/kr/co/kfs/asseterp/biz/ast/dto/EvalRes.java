package kr.co.kfs.asseterp.biz.ast.dto;

import java.time.LocalDate;

/**
 * 금융상품 평가처리(Ast06_Tab_EvalFinance, W09) 한 줄 — AS-IS ast06_tr.selectEvalList의 Ast06_TrModel.
 * 평가를 아직 안 한 줄은 trId가 f_create_seq()로 임시 발급되고 evalYnName이 빈칸이다
 */
public record EvalRes(
        String evalYnName, String evalTypeName, LocalDate date, String corpAccountName, String astClassName, String classTreeName,
        Double qty, Long financeBookAmt, Double price, Long amt, Long pl, String holdPeriod, String note, String personName,
        Long trId, Long astClassTreeId, String trCode, String trName, Long personId, Long companyId, Long corpId, String corpName,
        String curCode, Double forAmt, Double fxRate, LocalDate preCloseDate, LocalDate preEvalDate, String evalType, Long journalId,
        String classTreeFullName, Long trFinanceId, Long accountId, Double forBookAmt, Long trUnit) {
}
