package kr.co.kfs.asseterp.biz.tdm.dto;

/** 승인 행의 이웃(하위·상위) 부서 의견 (AS-IS tdm59.selectChild·selectParent) */
public record CheckApprNeighborRes(Long chckApprCmntId, Long chckExctId, Long apprOrgId, Long apprEmpId, String apprStatusCode, String apprCmnt, String reportCmnt,
                                   String apprOrgName) {
}
