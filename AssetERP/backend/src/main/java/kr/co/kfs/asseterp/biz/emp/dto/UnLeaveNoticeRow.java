package kr.co.kfs.asseterp.biz.emp.dto;

import java.time.LocalDate;

/**
 * V39 미사용휴가 결재문서 일괄 생성에 쓰는 행 (AS-IS 화면이 서버로 보내던 Emp21_UnLeaveModel).
 * 그리드 조회 SQL(emp21_un_leave.selectByUnLeaveCode·selectByUnLeaveCode2)의 같은 열을 서버가 다시 읽는다.
 */
public record UnLeaveNoticeRow(Long unLeaveId, Long personId, String unLeaveCode, String unLeaveName, String personNo,
                               String personName, String orgName, String posName, String companyName,
                               LocalDate hireDate, LocalDate startDate, Long dutyRt,
                               Double totalDays, Double useDays, Double remainDays,
                               LocalDate leaveOccurStartDate, LocalDate leaveOccurCloseDate,
                               LocalDate leaveTargetStartDate, LocalDate leaveTargetCloseDate) {

    /** AS-IS Emp21_UnLeaveModel.getDutyRt L293-298: 회사 의무사용율(sys01_leave_compulsion_rt)이 비어 있으면 100 */
    @Override
    public Long dutyRt() {
        return dutyRt == null ? 100L : dutyRt;
    }
}
