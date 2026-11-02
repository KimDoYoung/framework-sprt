package kr.co.kfs.asseterp.biz.mkt.dto;

/** AS-IS mkt01_target_company.selectFavoritePaging — 즐겨찾기한 담당자 한 줄 */
public record MktFavoriteRes(
        Long favoriteId,
        Long targetCompanyId,
        String targetCompanyName,
        String managerName,
        String managerPosName,
        String managerOrgName) {
}
