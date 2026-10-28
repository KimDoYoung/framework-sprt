package kr.co.kfs.asseterp.biz.pay.dto;

import java.time.LocalDate;

/** 급여출금계좌 한 행(Pay03_Lookup_PayAccount) */
public record PayAccountRes(Long accountId, LocalDate startDate, Long astClassTreeId, String astClassTreeName,
                            String bankCd, String bankName, String accountNo, String accountName, String note) {
}
