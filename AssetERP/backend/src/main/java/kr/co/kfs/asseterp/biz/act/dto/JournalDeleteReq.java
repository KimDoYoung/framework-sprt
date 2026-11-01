package kr.co.kfs.asseterp.biz.act.dto;

import jakarta.validation.constraints.NotEmpty;

import java.util.List;

/** act.Act02_Journal.delete — 지울 전표 ID */
public record JournalDeleteReq(@NotEmpty List<Long> journalIds) {
}
