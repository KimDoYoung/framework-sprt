package kr.co.kfs.asseterp.biz.ics.dto;

/** 관리그룹 공유 한 행 (AS-IS Ics04_ShareModel, ics04_share.selectByManagerId): 구분(직원/부서)·부서 */
public record IcsShareRes(Long shareId, String shareCode, String shareName, Long personId, String personName, Long orgId, String orgName, Long companyId) {
}
