package kr.co.kfs.asseterp.biz.icam.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * AS-IS Icam10_FeeModel 중 Icam10_Tab_FeeAdmin(D08)·Icam10_Tab_OfficeMngFee(X23) 그리드가 쓰는 열. feeId는 numeric이라 문자열.
 * fundCode·curCode·fxRate는 X23 그리드의 열이다(D08 화면은 쓰지 않는다)
 */
public record IcamFeeRes(String feeId, LocalDate stdDate, String icamCompanyCode, String icamCompanyName, String fundCode, String fundName,
                         String rmkName, String curCode, BigDecimal fee, BigDecimal fxRate, LocalDate afPayDate, LocalDate bfPayDate,
                         String workDateString, String worker) {
}
