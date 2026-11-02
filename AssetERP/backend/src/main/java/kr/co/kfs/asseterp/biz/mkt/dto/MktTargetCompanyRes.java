package kr.co.kfs.asseterp.biz.mkt.dto;

/** AS-IS Mkt01_TargetCompanyModel (selectByCompanyIdPaging·selectById) — 업무활동처 한 줄 */
public record MktTargetCompanyRes(
        Long targetCompanyId,
        String itemTypeCode,
        String targetCompanyName,
        String addr,
        String tel,
        String note,
        Boolean unuseYn,
        String itemTypeName,
        String managerInfo,
        String shareInfo) {
}
