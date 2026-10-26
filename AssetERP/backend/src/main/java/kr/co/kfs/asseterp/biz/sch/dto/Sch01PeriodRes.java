package kr.co.kfs.asseterp.biz.sch.dto;

import java.time.LocalDate;

/** 기간별 업무일정 조회 한 행 (AS-IS Sch01_InfoModel — sch01_info.selectByCloseDate). infoId는 SQL의 ROW_NUMBER, 실제 일정 ID는 realInfoId(classId 0이면 공모주 ID) */
public record Sch01PeriodRes(LocalDate closeDate, LocalDate manageDate, String className, String title, String contentLimit, String deadlineName,
                             String statusName, String personName, String note, Long realInfoId, Long infoId, Long classId, Long deadlineId,
                             String content, Long managerId, String managerName, Long personId, String orgName, Long companyId) {
}
