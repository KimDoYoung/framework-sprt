package kr.co.kfs.asseterp.biz.pay.dto;

import java.util.List;

/** Pay10_Lookup_RemLeaveDays [계산] 결과 — pay16(임시계산) + pay15(monthId=사원ID) 그리드 */
public record PayRetireLeaveCalcRes(Double remainLeaveDays, Double addLeaveDays, Double totalRemainLeaveDays,
                                    List<PayRetireLeaveRowRes> entry, List<PayRetireLeaveRowRes> fiscal) {
}
