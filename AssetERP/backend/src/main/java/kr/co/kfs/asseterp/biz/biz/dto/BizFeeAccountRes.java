package kr.co.kfs.asseterp.biz.biz.dto;

import java.time.LocalDate;

/** biz29_account.selectBySearchText·selectById — 보수입금계좌 한 행 (Biz29_Lookup_Account, EE21) */
public record BizFeeAccountRes(
        Long accountId,
        Long companyId,
        Long corpId,
        LocalDate startDate,
        String bankCd,
        String accountNo,
        String accountNm,
        Long astClassTreeId,
        String note,
        String corpNm,
        String bankNm,
        String astClassTreeNm
) {
}
