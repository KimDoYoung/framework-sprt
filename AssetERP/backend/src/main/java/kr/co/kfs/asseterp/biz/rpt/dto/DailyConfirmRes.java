package kr.co.kfs.asseterp.biz.rpt.dto;

import java.time.LocalDate;

/** 일일업무 확인 그리드 행 (AS-IS Rpt01_DailyModel, rpt01_daily.selectByConfirmText) */
public record DailyConfirmRes(
        Long dailyId,
        String personOrg,
        Long personId,
        String personName,
        LocalDate date,
        String content,
        String confirmNote,
        Boolean confirmYn,
        String confirmYnName
) {
}
