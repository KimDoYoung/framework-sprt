package kr.co.kfs.asseterp.biz.crm.dto;

/** 영업거래처 저장 (AS-IS crm.Crm09_Contact.modelUpdate — UpdateDataModel). contactId가 없으면 새로 만든다(번호는 서버가 받는다) */
public record CrmContactSaveReq(Long contactId, String contactName, String itemTypeCode,
                                String contactEmpName, String contactOrgName, String contactTitle, String contactPos,
                                String contactTelNo, String contactMobileNo, String contactEmailAddr,
                                String majorIssues, String note) {
}
