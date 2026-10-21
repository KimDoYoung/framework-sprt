package kr.co.kfs.asseterp.biz.flt.dto;

/** 임직원매매 기준관리 한 행 (AS-IS flt01_company_std.selectByCompanyId·selectById, J09). yn 열은 'true'/'false' 문자열 */
public record CompanyStdRes(Long companyStdId, Long companyId, String startDate, Long totalInvestAmt,
                            String investAmtCalcTargetCode, String investAmtCalcTargetName,
                            String investAmtOverCheckYn, String investLimitUnvisibleYn,
                            Long turnoverRate, Long apprOverRate, Long apprQtyOverRate, Long apprValidDays,
                            String stdDateType, String stdDateTypeName, String fundHoldStkYn, String lockUpDetailName,
                            String rptStartDate, String trFileEvidYn, String noAccountSkipYn,
                            String lockUpCode, Long lockUpDays, String lockUpCalcStdCode,
                            String buyOprDayYn, String buyOprMonthYn) {
}
