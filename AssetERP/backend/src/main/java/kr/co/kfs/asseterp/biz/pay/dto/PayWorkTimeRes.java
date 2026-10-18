package kr.co.kfs.asseterp.biz.pay.dto;

import java.time.LocalDate;

/** 근로시간 기준 한 행 — 화면 그리드 열 순서(적용시작일 · 일일법정근로시간 · 주 최대추가근로시간 · 야간 시작/종료 · 가산 배수 4) */
public record PayWorkTimeRes(Long workTimeConfigId, LocalDate startDate, Long dayWorkHours, Long weekMaxAddHours,
                             String ntStartTime, String ntEndTime, Double otMultRate, Double ntMultRate,
                             Double holiStdMultRate, Double holiOverMultRate) {
}
