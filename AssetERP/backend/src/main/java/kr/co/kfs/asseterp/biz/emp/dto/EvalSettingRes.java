package kr.co.kfs.asseterp.biz.emp.dto;

/** 회사의 인사평가 설정 (AS-IS sys01_company.selectById 중 empEvalCycleCode·empEvalMonthCode) — 05 반기별 / 06 연별, 시작월(MonthsCode) */
public record EvalSettingRes(String empEvalCycleCode, String empEvalMonthCode) {
}
