package kr.co.kfs.asseterp.biz.tdm.dto;

/** 이행점검 연결 상신문서 (AS-IS Tdm56_ChckRelateApprModel — selectApprStatus·selectByCeoRoleId) */
public record CheckApprRes(Long apprId, String apprStatusCode, String apprStatusName) {
}
