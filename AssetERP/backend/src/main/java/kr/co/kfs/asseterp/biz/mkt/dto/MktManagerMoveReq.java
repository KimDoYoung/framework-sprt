package kr.co.kfs.asseterp.biz.mkt.dto;

/** AS-IS Mkt02_Manager.updateTargetCompanyId — 고른 담당자들을 다른 활동처로 옮긴다 */
public record MktManagerMoveReq(Long targetCompanyId, java.util.List<Long> managerIds) {
}
