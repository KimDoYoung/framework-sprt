package kr.co.kfs.asseterp.biz.ast.dto;

import jakarta.validation.constraints.NotEmpty;

import java.util.List;

/** ast.Ast07_Settle.delete 요청 — 취소할 결제 ID */
public record SettleIdsReq(@NotEmpty List<Long> settleIds) {
}
