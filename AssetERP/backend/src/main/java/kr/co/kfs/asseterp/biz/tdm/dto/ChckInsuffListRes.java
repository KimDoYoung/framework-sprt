package kr.co.kfs.asseterp.biz.tdm.dto;

/** 미흡내역 조치 목록·조치 창이 읽는 미흡/개선 내역 한 행 (AS-IS Tdm54_ChckInsuffModel — selectByRegDate·selectById). 날짜는 'yyyy-MM-dd' */
public record ChckInsuffListRes(Long chckInsuffId, Long chckManlId, Long companyId, Long roleId, Long orgId, String checkYm, String regDate,
                                String roleName, String orgName, String actionName, String actionPlan, String statusCode, String statusName,
                                String planRegEmpName, Long planActionEmpId, String planActionEmpName, Long actionEmpId, String actionEmpName,
                                String dueDate, String actionDate, String actionCmnt) {
}
