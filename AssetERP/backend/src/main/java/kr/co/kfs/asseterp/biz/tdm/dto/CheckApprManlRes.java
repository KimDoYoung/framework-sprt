package kr.co.kfs.asseterp.biz.tdm.dto;

/** 승인할 점검항목 한 행 (AS-IS Tdm52_ChckManlModel — selectByChckApprCmntId) */
public record CheckApprManlRes(Long chckManlId, Long chckOrgId, Long chckJobId, Long companyId, Long manlId, Long manlOrgId, Long orgId, String orgName, String checkYm,
                           String commonTypeName, String taskName, String checkItem, String checkCycleInfo, String checkHow,
                           String checkEvidDocName, String refBasis, Long checkerId, String checkerName, String checkDate,
                           String checkResultCode, String checkResultName, String checkCmnt, String checkStatusCode, String checkStatusName,
                           Long chckManlApprId, String apprStatusCode, String apprStatusName, String apprCmnt, String fileCountStr,
                           Boolean finalApprEmpYn) {
}
