package kr.co.kfs.asseterp.biz.est.dto;

import jakarta.validation.constraints.NotNull;

/** 용역계약의 결재 문서 번호 기록 (est.Est02_PfContract.updateApprId · updateResultApprId) */
public record PfContractApprIdReq(@NotNull Long apprId) {
}
