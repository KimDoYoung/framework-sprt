package kr.co.kfs.asseterp.biz.emp.dto;

/** AS-IS emp36_add_deduct.selectByDeductId */
public record AddDeductRes(
        Long addDeductId,
        Long deductId,
        String addDeductType,
        String addDeductTypeName,
        Long addDeductCnt
) {}
