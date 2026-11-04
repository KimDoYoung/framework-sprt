package kr.co.kfs.asseterp.biz.crm.dto;

/** 공유지정 한 줄 (AS-IS Crm14_ShareDefaultModel · Crm15_ShareModel). shareId = 줄 번호 */
public record CrmShareRes(Long shareId, String shareCode, String shareName, Long personId, String personName, Long orgId, String orgName) {
}
