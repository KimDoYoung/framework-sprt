package kr.co.kfs.asseterp.biz.sys.dto;

import java.time.LocalDate;

/** AS-IS Sys95_ManualModel (sys95_manual.selectByText) — 매뉴얼 첨부 파일 한 건 */
public record ManualRes(
        Long manualId,
        LocalDate regDate,
        String manualType,
        String manualTypeNm,
        Long fileId,
        String fileNm,
        String fileExt,
        String note
) {
}
