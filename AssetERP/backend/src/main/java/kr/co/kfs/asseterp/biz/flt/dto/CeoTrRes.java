package kr.co.kfs.asseterp.biz.flt.dto;

/** 책임자보고 > 임직원매매명세 (AS-IS flt10_tr.selectByStdDate2) */
public record CeoTrRes(Long trId, Long personId, String personName, String orgName, String checkCycleName, String trYn,
                       Long depositAmt, Long totalInvestAmt, String corpName, String accountNo, String accountName,
                       String trItemName, String trTypeName, String regDate, Double expectTrQty, String trDate,
                       Double trQty, Double unitPrice, Long trAmt) {
}
