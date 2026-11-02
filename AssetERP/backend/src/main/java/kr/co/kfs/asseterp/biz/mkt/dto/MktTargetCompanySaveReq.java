package kr.co.kfs.asseterp.biz.mkt.dto;

/** AS-IS Mkt01_TargetCompany.updateOne 의 updateModel — targetCompanyId가 이미 있으면 UPDATE, 없으면 INSERT (id는 GET next-id로 먼저 받는다) */
public record MktTargetCompanySaveReq(
        Long targetCompanyId,
        String itemTypeCode,
        String targetCompanyName,
        String addr,
        String tel,
        String note,
        Boolean unuseYn) {
}
