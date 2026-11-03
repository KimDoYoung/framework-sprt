package kr.co.kfs.asseterp.biz.apr.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.util.List;

/** 문서분류 변경 (Dcr01_Move_DcrClass.update → apr.Apr01_Appr.updateParentId) — 고른 문서들을 classTreeId(최하위 분류)로 옮긴다 */
public record AprMoveClassReq(@NotEmpty List<Long> apprIds, @NotNull Long classTreeId) {
}
