package kr.co.kfs.asseterp.biz.pay.dto;

import java.time.LocalDate;

/** 연봉계약 한 행 — AS-IS Pay01_AnnualModel (pay01_annual.selectByAll·selectByPersonId 결과 열) */
public record PayAnnualRes(
        Long annualId,
        Long companyId,
        Long personId,
        String posName,
        String personNo,
        String personName,
        LocalDate startDate,
        LocalDate closeDate,
        String startTime,
        String closeTime,
        Long monthOtHours,
        Long annualPay,
        Long retirePay,
        Long yearPay,
        String etcAgreement,
        Long basicPay,
        Long mealPay,
        Long carMt,
        Long childcareAllowance,
        Long overPay,
        Long etc01Pay,
        Long etc02Pay,
        Long monthPay,
        String note,
        Long apprId,
        String apprStatusCode,
        String apprStatusName,
        LocalDate birthDay,
        LocalDate hireDate,
        String companyName,
        String companyAddress,
        String companyAgent,
        String orgName,
        String personAddress
) {
}
