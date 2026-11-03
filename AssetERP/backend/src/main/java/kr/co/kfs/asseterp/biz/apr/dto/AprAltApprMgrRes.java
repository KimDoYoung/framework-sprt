package kr.co.kfs.asseterp.biz.apr.dto;

import java.time.LocalDate;

/** 대결자 지정(관리자) 한 행 (AS-IS Apr07_AltApprModel — Apr07_Tab_AltApprMgr 그리드). 부서·직책은 종료일 기준 발령 */
public record AprAltApprMgrRes(
        Long altApprId,
        Long targetEmpId, String targetEmpNo, String targetEmpName, String targetOrgName, String targetTitleName,
        Long altEmpId, String altEmpNo, String altEmpName, String altOrgName, String altTitleName,
        LocalDate startDate, LocalDate closeDate, String stampYn, String reasonCd, String emgrPoint, String note
) {
}
