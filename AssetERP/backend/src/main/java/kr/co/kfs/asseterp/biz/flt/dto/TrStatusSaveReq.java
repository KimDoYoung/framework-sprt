package kr.co.kfs.asseterp.biz.flt.dto;

import jakarta.validation.constraints.NotNull;

/** 메모 저장 (AS-IS flt.Flt15_TrStatus.update — note만 바꾼다) */
public record TrStatusSaveReq(@NotNull Long trStatusId, String note) {
}
