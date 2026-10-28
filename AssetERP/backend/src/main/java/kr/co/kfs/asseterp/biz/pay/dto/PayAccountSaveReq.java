package kr.co.kfs.asseterp.biz.pay.dto;

import java.time.LocalDate;

/** 급여출금계좌 저장 한 행 — accountId가 0 이하이거나 없으면 새 행 */
public record PayAccountSaveReq(Long accountId, LocalDate startDate, Long astClassTreeId, String bankCd,
                                String accountNo, String accountName, String note) {
}
