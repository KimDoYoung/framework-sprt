package kr.co.kfs.asseterp.biz.biz.dto;

import java.time.LocalDate;

/** biz.Biz29_Account.update — 저장할 한 행. accountId 가 이미 있으면 UPDATE, 없으면 INSERT (UpdateDataModel) */
public record BizFeeAccountSaveReq(
        Long accountId,
        Long corpId,
        LocalDate startDate,
        String bankCd,
        String accountNo,
        String accountNm,
        Long astClassTreeId,
        String note
) {
}
