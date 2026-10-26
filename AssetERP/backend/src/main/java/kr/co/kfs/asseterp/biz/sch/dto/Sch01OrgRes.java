package kr.co.kfs.asseterp.biz.sch.dto;

import java.time.LocalDate;

/** 부서별 업무일정 조회 한 행 (AS-IS Sch01_InfoModel — sch01_info.selectByOrg). infoId는 SQL의 ROW_NUMBER, 실제 일정 ID는 realInfoId(classId 0이면 공모주 ID). 생성자 순서 = 매퍼 SELECT 순서 */
public record Sch01OrgRes(LocalDate closeDate, LocalDate manageDate, String className, String title, String content, String deadlineName,
                          String statusName, String personName, String note, Long realInfoId, Long infoId, Long classId, Long deadlineId,
                          Long managerId, String managerName, Long personId, String orgName, Long companyId) {
}
