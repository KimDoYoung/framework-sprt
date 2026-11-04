package kr.co.kfs.asseterp.biz.crm.dto;

import java.time.LocalDate;

/** 영업거래처 한 건 (AS-IS Crm09_ContactModel 중 Crm09_Lookup_ContactPoint가 다루는 값). shareInfo = 공유기본 요약("이름 외 n") */
public record CrmContactDetailRes(Long contactId, String contactName, String itemTypeCode, String itemTypeName,
                                  String contactEmpName, String contactOrgName, String contactTitle, String contactPos,
                                  String contactTelNo, String contactMobileNo, String contactEmailAddr,
                                  LocalDate contactDate, Long personId, Long companyId,
                                  String majorIssues, String note, String shareInfo) {
}
