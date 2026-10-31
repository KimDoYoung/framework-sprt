package kr.co.kfs.asseterp.biz.tdm.dto;

import jakarta.validation.constraints.NotNull;

/** 책무 결재 상신 뒤 결재문서 번호 기록 (tdm34·tdm31·tdm32 updateApprId) */
public record TdmApprLinkIdReq(@NotNull Long apprId) {
}
