package kr.co.kfs.asseterp.biz.pay.dto;

import java.time.LocalDate;

/** 퇴직정산서 결재문서 본문의 사원·퇴직 정보 (AS-IS Pay10_MonthModel, pay10_month.selectByPersonId, V18) */
public record PayRetireLinkRow(Long monthId, Long personId, String payCd, LocalDate date, String personName, String orgName, String posName, String retireDate) {
}
