package kr.co.kfs.asseterp.biz.emp.dto;

import java.time.LocalDate;

/** Emp33_Lookup_ExceptBiz 그리드 (AS-IS emp33_except_biz.selectByExceptBizCode) — 사원별 예외업무 */
public record ExceptBizRes(Long exceptBizId, Long companyId, Long personId, String exceptBizCode, String exceptBizName,
                           LocalDate startDate, LocalDate closeDate, String reason, String unvisibleYn, String personName, String personInfo) {
}
