package kr.co.kfs.asseterp.biz.frm.dto;

import java.time.LocalDate;

/** MyPage 일정 박스 부서일정 한 행 (AS-IS Sch01_InfoModel — sch01_info.selectMyPageOrgSchedule, buildGrid01_1 L190-194) */
public record FrmRelateOrgScheduleRes(
        Long rowId,
        String orgName,
        String className,
        String title,
        LocalDate closeDate,
        Long deadlineId,
        Long realInfoId
) {
}
