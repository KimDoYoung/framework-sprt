package kr.co.kfs.asseterp.biz.crm.dto;

/** 영업 거래처 조회창(Crm09_Lookup_SelectSingle) open("emp") 한 행 — 이익제공 인원의 회사명·담당자명. contactId = SQL의 row_number() */
public record CrmContactEmpRes(Long contactId, String contactName, String contactEmpName) {
}
