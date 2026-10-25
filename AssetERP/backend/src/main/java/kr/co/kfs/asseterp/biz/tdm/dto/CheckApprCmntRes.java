package kr.co.kfs.asseterp.biz.tdm.dto;

/** 직책별 승인의견 한 행 (AS-IS tdm59_chck_appr_cmnt.selectByApprOrgId — SELF) */
public record CheckApprCmntRes(Long chckApprCmntId, String apprStatusCode, String apprOrgName, String apprEmpName) {
}
