package kr.co.kfs.asseterp.biz.tdm.dto;

/** 매뉴얼 작업대상 한 행 (AS-IS Tdm40_ManlJobModel, N15). 일자는 yyyy-MM-dd */
public record ManlJobRes(Long manlJobId, Long companyId, String regDate, String jobName, String manlApplyStartDate,
                         Long roleId, String roleName, Long orgId, String orgName, String jobReason,
                         String startDate, String endDate, String dutyCntStr, boolean dutyEndYn, String dutyEndDate,
                         String updName, String updDateStr) {
}
