package kr.co.kfs.asseterp.biz.tdm.dto;

import java.time.LocalDate;

/** 직무겸직(사내) 한 행 (AS-IS tdm03_add_title.selectByPersonId → Tdm03_AddTitleModel) */
public record AddTitleRes(
        Long addTitleId,
        Long personId,
        String addTitleName,
        LocalDate startDate,
        LocalDate closeDate
) {
}
