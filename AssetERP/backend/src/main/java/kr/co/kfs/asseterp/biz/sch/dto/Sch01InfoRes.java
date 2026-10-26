package kr.co.kfs.asseterp.biz.sch.dto;

/**
 * 업무일정 (AS-IS Sch01_InfoModel — sch01_info.selectByText / selectById).
 */
public record Sch01InfoRes(Long infoId, Long companyId, String title, String content, String report, Long managerId, String managerName, String note,
                           Boolean useYn, Long dcrClassTreeId, String dcrClassTreeName, Boolean privateYn, Boolean dailyYn, Long classId,
                           String className, String deadlineName, String deadlineFullName, String shareOrgName, String sharePersonName,
                           String icsClassTreeName, String privateYnName, String dailyYnName, String alarmInfo) {
}
