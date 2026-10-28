package kr.co.kfs.asseterp.biz.pay.dto;

/** 연차수당 계산값(pay15 getRetireLeave) 또는 임시계산값(pay16 selectRemLeaveDays — dailyAmt·retireLeaveAmt는 null) */
public record PayRetireLeaveSummary(Double remainLeaveDays, Double addLeaveDays, Double totalRemainLeaveDays,
                                    Long dailyAmt, Long retireLeaveAmt) {
}
