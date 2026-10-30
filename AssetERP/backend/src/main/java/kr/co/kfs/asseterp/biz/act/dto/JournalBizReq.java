package kr.co.kfs.asseterp.biz.act.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.util.List;

/** act.Act02_Journal.createJournalBiz·deleteJournalBiz 요청 — stdMonth는 "yyyy.MM" */
public record JournalBizReq(@NotNull String stdMonth, @NotEmpty List<JournalBizRowReq> rows) {
}
