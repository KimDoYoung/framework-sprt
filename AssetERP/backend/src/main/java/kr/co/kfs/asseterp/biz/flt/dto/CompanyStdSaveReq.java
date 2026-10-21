package kr.co.kfs.asseterp.biz.flt.dto;

/**
 * 임직원매매 기준관리 저장 행 (J09). 새 행(companyStdId ≤ 0)은 모든 열을 INSERT — 등록(복사)이 원본 행의 의무보유기간 열도 가져가기 때문.
 * 기존 행은 그리드에서 고치는 열만 UPDATE(의무보유기간 열은 조회창 updateLockup이 따로 고친다)
 */
public record CompanyStdSaveReq(Long companyStdId, String startDate, Long totalInvestAmt, String investAmtCalcTargetCode,
                                String investAmtOverCheckYn, String investLimitUnvisibleYn, Long turnoverRate,
                                Long apprOverRate, Long apprQtyOverRate, Long apprValidDays, String stdDateType,
                                String fundHoldStkYn, String rptStartDate, String trFileEvidYn, String noAccountSkipYn,
                                String lockUpCode, Long lockUpDays, String lockUpCalcStdCode,
                                String buyOprDayYn, String buyOprMonthYn) {
}
