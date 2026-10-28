package kr.co.kfs.asseterp.biz.pay.dto;

import java.time.LocalDate;

/** 급여관리(항목별) [일괄생성] — 구분·지급일의 모든 사원에게 항목을 금액 0으로 추가한다 */
public record PayMonthItemBulkReq(String payCode, LocalDate payDate, String itemType, String itemCode) {
}
