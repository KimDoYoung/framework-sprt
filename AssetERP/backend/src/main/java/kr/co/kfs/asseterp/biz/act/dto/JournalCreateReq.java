package kr.co.kfs.asseterp.biz.act.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

/** AS-IS act.Act02_Journal.createJournal — 회사·사원은 로그인 값을 쓴다 */
public record JournalCreateReq(@NotNull Long trId, @NotBlank String trCode, @NotBlank String procType, boolean exceptYn) {
}
