package kr.co.kfs.asseterp.biz.biz.dto;

/** biz15_share.selectByContHistoryId — 공유자/부서 */
public record BizContShareRes(Long shareId, Long contHistoryId, String shareCd, Long personId, Long orgId, Long companyId,
                              String shareNm, String personNm, String orgNm) {
}
