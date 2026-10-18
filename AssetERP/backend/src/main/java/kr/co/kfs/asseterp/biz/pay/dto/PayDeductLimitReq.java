package kr.co.kfs.asseterp.biz.pay.dto;

import java.time.LocalDate;

/** 공제한도 저장 요청 */
public record PayDeductLimitReq(LocalDate startDate, Long limitAmt) {
}
