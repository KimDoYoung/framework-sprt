package kr.co.kfs.asseterp.biz.ast.dto;

import jakarta.validation.constraints.NotNull;

/** AS-IS ast.Ast06_Tr.updateApprId — 상신한 문서ID를 거래에 남긴다 */
public record TrApprReq(@NotNull Long apprId) {
}
