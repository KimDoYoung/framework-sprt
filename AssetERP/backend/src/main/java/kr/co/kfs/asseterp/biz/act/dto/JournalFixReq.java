package kr.co.kfs.asseterp.biz.act.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Pattern;

import java.util.List;

/** act.Act02_Journal.updateFixYn — procType P 승인 / C 승인취소 */
public record JournalFixReq(@Pattern(regexp = "[PC]") String procType, @NotEmpty List<Long> journalIds) {
}
