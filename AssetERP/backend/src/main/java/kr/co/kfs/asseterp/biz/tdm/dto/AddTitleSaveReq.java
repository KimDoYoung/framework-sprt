package kr.co.kfs.asseterp.biz.tdm.dto;

import java.time.LocalDate;

/** 직무겸직(사내) 저장 한 행 — addTitleId가 null/0 이하면 신규 */
public record AddTitleSaveReq(
        Long addTitleId,
        Long personId,
        String addTitleName,
        LocalDate startDate,
        LocalDate closeDate
) {
}
