package kr.co.kfs.asseterp.biz.flt.dto;

/** 임직원매매현황 한 행 (AS-IS Flt02_EmpModel · flt02_emp.selectByCompanyId, J07 Flt02_Tab_EmpInfo). empId는 조회 순서 행번호 */
public record EmpInfoRes(
        Long empId,
        Long personId,
        String orgName,
        String personName,
        String oathYnName,
        String familyYnName,
        String accountCntStr,
        String checkCycle,
        String checkCycleName,
        String rcntReportDate,
        Long yearInvestLimit,
        Long yearInvestAmt,
        Long totalInvestAmt,
        Double turnoverRate,
        Long dailyAvg,
        String violateCntStr,
        String note,
        String noteDate) {
}
