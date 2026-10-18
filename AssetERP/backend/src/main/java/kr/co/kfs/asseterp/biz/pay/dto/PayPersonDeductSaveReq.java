package kr.co.kfs.asseterp.biz.pay.dto;

import java.time.LocalDate;

public record PayPersonDeductSaveReq(Long personDeductId, LocalDate startDate, String personDeductCode, Long deductAmt, String note) {
}
