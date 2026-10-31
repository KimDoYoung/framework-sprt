package kr.co.kfs.asseterp.biz.ics.dto;

import java.time.LocalDate;

/** 준수점검(준감인)의 사원 선택 한 줄 (AS-IS ics30_compliance.selectWriterId → Ics31_Lookup_SelectPerson, V28) */
public record IcsComplianceWriterRes(Long personId, String orgName, String titleName, String empNo, String personName, LocalDate transDate) {
}
