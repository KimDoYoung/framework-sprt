package kr.co.kfs.asseterp.biz.flt.dto;

/** 사원의 상신문서 한 행 (AS-IS Flt10_TrModel · flt10_tr.selectByApprId, J06 Flt10_Grid_EmpAppr) */
public record EmpApprDocRes(
        Long trId,
        Long apprId,
        String apprRegDate,
        String apprStatusCode,
        String apprStatusName,
        String apprTitle) {
}
