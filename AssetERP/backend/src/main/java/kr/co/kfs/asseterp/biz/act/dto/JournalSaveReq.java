package kr.co.kfs.asseterp.biz.act.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

import java.util.List;

/** AS-IS act.Act02_Journal.updateAll — 거래처·적요와 임시분개 줄 전체를 다시 쓴다 */
public record JournalSaveReq(
        Long corpId,
        String note,
        @NotNull @Valid List<Line> lines
) {
    /** 줄 순서가 곧 순번(10, 20, …) */
    public record Line(
            String drcrType,
            String realAccountCode,
            String reprAccountCode,
            String accountMap,
            Long amt,
            Double forAmt,
            Long depositId,
            String note
    ) {
    }
}
