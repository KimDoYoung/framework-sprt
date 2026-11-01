package kr.co.kfs.asseterp.biz.bmt.dto;

import java.time.LocalDate;

/** Bmt11_TabPage_History [저장] — 화면이 바꾸는 열(시작일자·사원·메신저·웹사이트·비고). historyId ≤ 0이면 새 행 */
public record BmtHistorySaveReq(
        Long historyId,
        Long personId,
        LocalDate startDate,
        String messenger,
        String website,
        String note
) {
}
