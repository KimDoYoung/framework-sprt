package kr.co.kfs.asseterp.biz.bmt.dto;

import java.time.LocalDate;

/** Bmt11_TabPage_History 그리드 한 행 — AS-IS bmt11_history.selectByInfoId */
public record BmtHistoryRes(
        Long historyId,
        Long infoId,
        Long personId,
        String personName,
        LocalDate startDate,
        String messenger,
        String website,
        String note
) {
}
