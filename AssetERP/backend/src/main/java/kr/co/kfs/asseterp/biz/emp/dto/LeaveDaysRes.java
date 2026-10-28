package kr.co.kfs.asseterp.biz.emp.dto;

/** 휴가관리 요약 칸 (AS-IS emp20_leave.selectByDays + emp22_etc_leave.selectByDays) */
public record LeaveDaysRes(
        Double totalDays,
        Double pyRemainMonthDays,
        Double useDays,
        Double remainDays,
        String stdPeriod,
        Double etcTotalDays,
        Double etcUseDays,
        Double etcRemainDays
) {
}
