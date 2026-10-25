package kr.co.kfs.asseterp.biz.tdm.dto;

/** 승인할 미흡/개선 내역 한 행 (AS-IS Tdm54_ChckInsuffModel — selectByChckApprCmntId·selectById). selectById는 승인 열이 없다(AS-IS 그대로) */
public record CheckApprInsuffRes(Long chckInsuffId, Long chckManlId, Long companyId, Long roleId, Long orgId, String orgName, String checkYm, String regDate,
                            String dueDate, String actionDate, String planRegEmpName, String planActionEmpName, String actionEmpName,
                            String actionEmpInfo, String actionName, String actionPlan, String actionCmnt, String statusCode,
                            String statusName, Boolean currMonthOccYn, Boolean firstApprEmpYn, Boolean finalApprEmpYn,
                            Long chckInsuffApprId, String apprStatusCode, String apprStatusName, String apprCmnt) {
}
