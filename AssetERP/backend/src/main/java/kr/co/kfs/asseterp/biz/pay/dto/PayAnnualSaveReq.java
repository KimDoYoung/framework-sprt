package kr.co.kfs.asseterp.biz.pay.dto;

import java.time.LocalDate;

/** 연봉계약 저장 한 행 — annualId가 0 이하이거나 DB에 없으면 등록 */
public record PayAnnualSaveReq(
        Long annualId,
        Long personId,
        LocalDate startDate,
        LocalDate closeDate,
        String startTime,
        String closeTime,
        Long monthOtHours,
        Long annualPay,
        Long retirePay,
        String etcAgreement,
        Long basicPay,
        Long mealPay,
        Long carMt,
        Long childcareAllowance,
        Long overPay,
        Long etc01Pay,
        Long etc02Pay
) {
}
