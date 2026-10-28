package kr.co.kfs.asseterp.biz.pay.dto;

/** 급여 생성이 쓰는 결재완료 연봉정보(pay01_annual.selectByApprStatus) — 항목 금액 계산에 쓰는 열만 */
public record PayMonthAnnualRes(Long basicPay, Long overPay, Long etc01Pay, Long etc02Pay, Long mealPay, Long carMt,
                                Long childcareAllowance) {
}
