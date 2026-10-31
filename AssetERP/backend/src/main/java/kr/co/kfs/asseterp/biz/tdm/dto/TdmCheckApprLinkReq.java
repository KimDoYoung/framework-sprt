package kr.co.kfs.asseterp.biz.tdm.dto;

import jakarta.validation.constraints.NotNull;

/** 이행점검 보고서(A94) 상신 뒤 연결 기록 (tdm.Tdm56_ChckRelateAppr.insertApprId) */
public record TdmCheckApprLinkReq(@NotNull Long roleId, @NotNull Long apprId) {
}
