package kr.co.kfs.asseterp.biz.flt.dto;

/** 정기보고 상신문서 연결 한 행 (AS-IS flt14_relate_appr.selectByStdDate) */
public record RelateApprRes(
        Long relateApprId,
        Long apprId,
        String apprRegDate,
        String apprTitle,
        String apprStatusCode,
        String apprStatusName) {
}
