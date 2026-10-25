package kr.co.kfs.asseterp.biz.tdm.dto;

/** 이행점검 승인 현황 한 행 — 직책·검토부서별 SELF(자기 부서 종합의견)/SUB(하위 부서별 의견) (AS-IS Tdm59_ChckApprCmntModel — selectByApprEmpId) */
public record CheckApprListRes(Long chckApprCmntId, Long chckExctId, Long apprOrgId, Long apprEmpId, String cmntType, Long parentOrgId, Long childOrgId,
                           String apprStatusCode, String apprCmnt, String reportCmnt, Boolean submitYn, Long roleId, String roleName,
                           Long checkOrgId, String checkOrgName, String checkOrgName2, Long monthCheckCnt, Long monthCheck1Cnt,
                           Long monthCheck2Cnt, Long monthCheck9Cnt, Long insuffUndoneCnt, Long insuffDoneCnt, Boolean insuffStatus20Yn,
                           String checkStatusCode, String checkStatusName, Boolean checkStatusAll21Yn, Boolean firstApprEmpYn,
                           Boolean finalApprEmpYn, Long companyId, String checkYm, Long chckJobId, String preApprStatusName,
                           String apprStatusName, String nextApprStatusName, Integer apprButtonEnable, Integer reportButtonEnable) {
}
