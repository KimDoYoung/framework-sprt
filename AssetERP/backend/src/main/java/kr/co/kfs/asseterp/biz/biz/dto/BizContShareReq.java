package kr.co.kfs.asseterp.biz.biz.dto;

/** biz.Biz15_Share.update — 새로 추가한 공유자/부서 한 건 (shareCd: 1 직원 / 2 부서) */
public record BizContShareReq(Long contHistoryId, String shareCd, Long personId, Long orgId) {
}
