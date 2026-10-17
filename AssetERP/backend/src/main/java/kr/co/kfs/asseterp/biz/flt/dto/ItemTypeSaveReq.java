package kr.co.kfs.asseterp.biz.flt.dto;

public record ItemTypeSaveReq(Long itemTypeId, String itemTypeCode, String itemTypeName, Long seq, String startDate,
                              String targetYn, String sellPreApprYn, String lockUpCheckYn, String stkPriceYn,
                              String listStkYn) {
}
