package kr.co.kfs.asseterp.biz.emp.dto;

/** AS-IS Emp35_TabPage_DeductInsert.update() → UpdateDataModel(emp35_deduct) */
public record DeductSaveReq(
        Long deductId,
        Long basicDeductCnt,
        String addDeductYn,
        String insureYn,
        String reprYn,
        Long withHoldRate,
        String note,
        Long childDeductCnt
) {}
