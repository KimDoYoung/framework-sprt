package kr.co.kfs.asseterp.biz.pay.dto;

import java.util.List;

/** Pay15_TabPage_RetireLeave.retrieve — 계산값(getRetireLeave) + 입사일기준(1)/회계일기준(2) 그리드 */
public record PayRetireLeaveRes(Double remainLeaveDays, Double addLeaveDays, Double totalRemainLeaveDays, Long dailyAmt,
                                Long retireLeaveAmt, List<PayRetireLeaveRowRes> entry, List<PayRetireLeaveRowRes> fiscal) {
}
