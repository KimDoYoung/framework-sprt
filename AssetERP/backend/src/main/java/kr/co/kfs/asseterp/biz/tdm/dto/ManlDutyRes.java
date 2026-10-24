package kr.co.kfs.asseterp.biz.tdm.dto;

/** 관리의무 한 행 (AS-IS tdm41_manl_duty.selectByTextPaging, N16). realManlDutyId = 진짜 tdm41 ID, useYn = 부서지정 확정(잠금) 여부 */
public record ManlDutyRes(Long manlDutyId, String title, String taskRelateDutyName, String orgName2, String updDateStr,
                          String roleName, String taskGubun, String taskName, Long realManlDutyId, boolean useYn) {
}
