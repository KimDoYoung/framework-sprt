package kr.co.kfs.asseterp.biz.act.dto;

import jakarta.validation.constraints.NotEmpty;

import java.util.List;

/** AS-IS act.Act80_RelateAppr.delete — 연결 제거 */
public record ActRelateApprDeleteReq(@NotEmpty List<Long> relateApprIds) {
}
