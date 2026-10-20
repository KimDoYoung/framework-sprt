package kr.co.kfs.asseterp.biz.ics.dto;

/** 관리그룹 저장 한 행 (AS-IS Ics02_ManagerModel 중 화면이 고치는 managerGroupName). 새 행은 managerId ≤ 0 */
public record IcsManagerSaveReq(Long managerId, String managerGroupName) {
}
