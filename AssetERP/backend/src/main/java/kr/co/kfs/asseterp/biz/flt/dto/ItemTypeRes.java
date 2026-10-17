package kr.co.kfs.asseterp.biz.flt.dto;

public record ItemTypeRes(Long itemTypeId, Long companyId, String companyName, String itemTypeCode, String itemTypeName,
                          Long seq, String startDate, String targetYn, String sellPreApprYn, String lockUpCheckYn,
                          String stkPriceYn, String listStkYn) {
}
