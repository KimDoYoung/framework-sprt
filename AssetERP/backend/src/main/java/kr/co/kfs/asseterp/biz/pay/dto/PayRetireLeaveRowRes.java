package kr.co.kfs.asseterp.biz.pay.dto;

/** pay15_retire_leave 한 행 — 근속(yearCntStr) · 대상기간 · 휴가수 */
public record PayRetireLeaveRowRes(Long retireLeaveId, Long monthId, String calcStdType, Long yearCnt, String yearCntStr,
                                   String periodDateStr, Double leaveDays) {
}
