package kr.co.kfs.asseterp.biz.ast.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.util.List;

/** ast.Ast07_Settle.updateMulti 요청 */
public record SettleMultiReq(@NotNull LocalDate settleDate, @NotNull Long depositId, @NotEmpty List<SettleMultiRowReq> rows) {
}
