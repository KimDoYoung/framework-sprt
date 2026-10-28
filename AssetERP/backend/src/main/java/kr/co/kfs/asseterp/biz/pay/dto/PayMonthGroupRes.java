package kr.co.kfs.asseterp.biz.pay.dto;

import java.time.LocalDate;

/** 지급구분/일자 조회(Pay10_Lookup_GroupList) 한 행 — AS-IS monthId는 ROW_NUMBER라 의미 없어 내지 않는다 */
public record PayMonthGroupRes(String payGroupNm, Long companyId, LocalDate date, String payCd) {
}
