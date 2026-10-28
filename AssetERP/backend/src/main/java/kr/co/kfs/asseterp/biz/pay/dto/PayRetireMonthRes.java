package kr.co.kfs.asseterp.biz.pay.dto;

import java.time.LocalDate;

/** 퇴직정산 급여 한 건(pay10_month, pay_cd 03) — retireDate는 f_get_emptrans 퇴직일(getRetireInfo) */
public record PayRetireMonthRes(Long monthId, Long companyId, String payCd, LocalDate date, Long personId, LocalDate retireDate) {
}
