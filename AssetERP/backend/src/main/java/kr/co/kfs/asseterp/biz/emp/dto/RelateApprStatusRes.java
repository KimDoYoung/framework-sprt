package kr.co.kfs.asseterp.biz.emp.dto;

/** 기준년월의 여비교통비 상신(지출결의) 문서 (AS-IS emp52_relate_appr.selectByCompanyId — Emp52_RelateApprModel). 결재 문서가 없으면 statusCode가 null */
public record RelateApprStatusRes(Long relateApprId, Long apprId, String statusCode, String statusName) {
}
