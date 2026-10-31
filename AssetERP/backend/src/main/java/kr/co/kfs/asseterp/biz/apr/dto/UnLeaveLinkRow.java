package kr.co.kfs.asseterp.biz.apr.dto;

import java.time.LocalDate;

/** A15 미사용 연차·월차 사용 시기 지정통보서 한 건 (AS-IS Emp21_UnLeaveModel 중 양식에 쓰는 값, V36) */
public record UnLeaveLinkRow(String unLeaveCode, String unLeaveName, String personName, String orgName, LocalDate hireDate, LocalDate noticeDate,
                             Long dutyRt, LocalDate leaveOccurStartDate, LocalDate leaveOccurCloseDate,
                             LocalDate leaveTargetStartDate, LocalDate leaveTargetCloseDate,
                             Double totalDays, Double useDays, String month01, String month02, String month03, String month04,
                             String month05, String month06, String companyName) {
}
