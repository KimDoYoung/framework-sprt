package kr.co.kfs.asseterp.biz.pay.dto;

import java.time.LocalDate;

/** 급여 한 행(Pay10_Tab_Month 왼쪽 그리드 — 사번 · 사원명 · 직급 · 지급액계 · 공제액계 · 차감지급액) + 근로시간 팝업이 쓰는 열 */
public record PayMonthRes(Long monthId, Long companyId, String payCd, LocalDate date, Long personId,
                          Double workDay, Double totalWorkTime, Double extendWorkTime, Double nightWorkTime, Double holidayWorkTime,
                          String note, String stdMonth, String personNo, String personNm, String posNm,
                          Long paySum, Long taxDdcSum, Long deductionSum) {
}
