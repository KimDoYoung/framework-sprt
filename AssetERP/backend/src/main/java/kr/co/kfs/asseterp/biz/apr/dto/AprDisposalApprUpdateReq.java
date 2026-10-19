package kr.co.kfs.asseterp.biz.apr.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.util.List;

/** 폐기 승인(20)·반려(99) 요청 (F10). disposalListIds = 선택한 행 */
public record AprDisposalApprUpdateReq(@NotNull String disposalCode, @NotEmpty List<Long> disposalListIds) {
}
