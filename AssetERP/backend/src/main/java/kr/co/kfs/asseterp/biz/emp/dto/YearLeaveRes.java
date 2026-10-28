package kr.co.kfs.asseterp.biz.emp.dto;

import java.time.LocalDate;

/** 연월차휴가 현황 한 행 (AS-IS Emp20_Tab_YearList 그리드) */
public record YearLeaveRes(
        Long personId,
        String empNo,
        String korName,
        LocalDate hireDateLeaveCalc,
        String yearPeriod,
        Double yearPer,
        Double yearLeaveDays,
        String monthPeriod,
        Double monthLeaveDays,
        Double pyRemainMonthDays,
        Double totalDays,
        Double useYearDays,
        Double useMonthDays,
        Double useDays,
        Double remainYearDays,
        Double remainMonthDays,
        Double remainDays,
        Long rewardTotalDays,
        Long rewardUseDays,
        Long rewardRemainDays,
        Double spcDays) {
}
