package kr.co.kfs.asseterp.biz.crm.dto;

/** 영업 거래처 조회창(Crm09_Lookup_SelectSingle) 한 행 — keyInCompany는 회사명 한 열. contactId = SQL의 row_number() */
public record CrmContactRes(Long contactId, String contactName) {
}
