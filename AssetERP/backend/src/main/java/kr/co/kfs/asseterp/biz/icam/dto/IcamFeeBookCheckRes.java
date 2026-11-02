package kr.co.kfs.asseterp.biz.icam.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

/** AS-IS Icam13_FeeBookCheckModel — 월말잔액 대사 결과 그리드 한 행 */
public record IcamFeeBookCheckRes(LocalDate stdDate, String result, BigDecimal diffAmt, String workerName, String workDateString) {
}
