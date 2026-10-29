package kr.co.kfs.asseterp.biz.ast.dto;

import jakarta.validation.constraints.NotNull;

/** 상신한 문서 ID 기록 (AS-IS ast.Ast80_RelateAppr.updateApprId) */
public record RelateApprApprIdReq(@NotNull Long apprId) {
}
