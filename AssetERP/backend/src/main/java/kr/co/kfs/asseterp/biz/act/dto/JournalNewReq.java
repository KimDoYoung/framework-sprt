package kr.co.kfs.asseterp.biz.act.dto;

import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.util.List;

/** act.Act02_Journal.updateAll — 새 전표(NEW) 요청. 줄 순서가 곧 순번(10, 20, …) */
public record JournalNewReq(@NotNull LocalDate date, Long corpId, String note, @NotNull List<JournalSaveReq.Line> lines) {
}
