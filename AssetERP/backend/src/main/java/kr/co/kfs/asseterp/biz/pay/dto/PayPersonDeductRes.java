package kr.co.kfs.asseterp.biz.pay.dto;

import java.time.LocalDate;

/** 인적공제금액(pay25) 한 행 — 구분 이름은 f_cdnm('PersonDeductCode') */
public record PayPersonDeductRes(Long personDeductId, LocalDate startDate, String personDeductCode, String personDeductName, Long deductAmt, String note) {
}
