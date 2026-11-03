package kr.co.kfs.asseterp.biz.apr.dto;

import jakarta.validation.constraints.NotNull;

/** 폐기문서 복구 요청 — 고른 문서ID (AS-IS request.putLongParam("apprId")) */
public record AprApprDelRestoreReq(@NotNull Long apprId) {
}
