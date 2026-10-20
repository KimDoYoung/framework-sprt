package kr.co.kfs.asseterp.biz.ics.dto;

/** 법규 관리그룹 한 행 (AS-IS Ics02_ManagerModel, ics02_manager.selectByCompanyId·getDefaultYn). defaultYn은 미지정 그룹 */
public record IcsManagerRes(Long managerId, String managerGroupName, Long personId, String personName, String note, Boolean defaultYn) {
}
