package kr.co.kfs.asseterp.biz.pay.dto;

import java.time.LocalDate;

/** 급여공제 기타설정(pay29) 한 행 */
public record PayOtherSetupRes(Long otherSetupId, LocalDate startDate, Long hiMaxDiv, Long eiMaxDiv, Long hiMinAmt, Long hiMaxAmt,
                               Long npMinAmt, Long npMaxAmt, Long stdTaxDeduct, String note) {
}
