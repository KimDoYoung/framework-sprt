package kr.co.kfs.asseterp.biz.frm.dto;

import java.time.LocalDate;

/** MyPage 일정 박스 나의일정 한 행 (AS-IS Sch01_InfoModel — sch01_info.selectMyPageSchedule, Monitoring_Page_Relate.buildGrid01 L171-176) */
public record FrmRelateMyScheduleRes(
        Long rowId,
        String className,
        String title,
        String managerName,
        LocalDate closeDate,
        LocalDate manageDate,
        Long deadlineId,
        Long realInfoId
) {
}
