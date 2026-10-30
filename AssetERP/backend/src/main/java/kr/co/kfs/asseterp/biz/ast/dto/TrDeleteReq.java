package kr.co.kfs.asseterp.biz.ast.dto;

import jakarta.validation.constraints.NotEmpty;

import java.util.List;

/** AS-IS ast.Ast06_Tr.delete — 체크한 거래들 */
public record TrDeleteReq(@NotEmpty List<Long> trIds) {
}
