package kr.co.kfs.asseterp.biz.pay.dto;

import java.time.LocalDate;

public record PayOtherSetupSaveReq(Long otherSetupId, LocalDate startDate, Long hiMaxDiv, Long eiMaxDiv, Long hiMinAmt, Long hiMaxAmt,
                                   Long npMinAmt, Long npMaxAmt, Long stdTaxDeduct, String note) {
}
