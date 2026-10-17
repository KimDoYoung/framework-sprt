package kr.co.kfs.asseterp.biz.icam.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

/** AS-IS Icam10_FeeModel 중 Icam10_Tab_FeeAdmin 그리드가 쓰는 열. feeId는 numeric이라 문자열 */
public record IcamFeeRes(String feeId, LocalDate stdDate, String icamCompanyCode, String icamCompanyName, String fundName, String rmkName,
                         BigDecimal fee, LocalDate afPayDate, LocalDate bfPayDate, String workDateString, String worker) {
}
