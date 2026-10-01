package kr.co.kfs.asseterp.oms.biz.emp.dto;

import java.time.LocalDate;

/** 사용자정보 (AS-IS emp01_person.selectBySearchTextPaging, 전 고객사) */
public record UserInfoRes(Long personId, String companyNm, String korNm, String empNo, String posNm, String orgNm,
                          String officeTelno, String mobileTelno, String emailAddr, LocalDate hireDate, String note) {
}
