package kr.co.kfs.asseterp.biz.icam.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

/** AS-IS Icam12_FeeBookModel — ICAM 펀드보수 월말잔액 그리드 한 행 */
public record IcamFeeBookRes(LocalDate stdDate, String icamCompanyCode, String icamCompanyName, String fundCode, String fundName,
                             String curCode, BigDecimal forFee, BigDecimal fee, String consignmentName, String workDateString, String worker) {
}
