package kr.co.kfs.asseterp.biz.ics.dto;

/** 관리그룹 공유 저장 한 행 (AS-IS Ics04_ShareModel 중 화면이 채우는 shareCode·orgId). 새 행은 shareId ≤ 0 */
public record IcsShareSaveReq(Long shareId, String shareCode, Long orgId) {
}
