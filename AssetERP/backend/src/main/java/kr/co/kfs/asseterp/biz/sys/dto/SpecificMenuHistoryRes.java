package kr.co.kfs.asseterp.biz.sys.dto;

import java.time.LocalDate;

/** A15-4 요청이력 행 (AS-IS Sys54_SpecificMenuHistoryModel) — fileNm은 sys10_file 첨부 이름 */
public record SpecificMenuHistoryRes(
        Long specificMenuHistoryId,
        Long companyId,
        LocalDate regDate,
        LocalDate confirmDate,
        String confirmNm,
        String note,
        String fileNm,
        String noteYnStr
) {
}
