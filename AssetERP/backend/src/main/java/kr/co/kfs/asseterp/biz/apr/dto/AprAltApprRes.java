package kr.co.kfs.asseterp.biz.apr.dto;

import java.time.LocalDate;

/** 대결자 지정 한 행 (AS-IS Apr07_AltApprModel — Apr07_Tab_AltAppr 그리드). altOrgName·altTitleName은 종료일 기준 발령 */
public record AprAltApprRes(
        Long altApprId,
        Long targetEmpId,
        Long altEmpId,
        String altEmpNo,
        String altEmpName,
        String altOrgName,
        String altTitleName,
        LocalDate startDate,
        LocalDate closeDate,
        String stampYn,
        String reasonCd,
        String emgrPoint
) {
}
