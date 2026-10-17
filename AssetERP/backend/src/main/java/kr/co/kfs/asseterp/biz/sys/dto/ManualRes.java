package kr.co.kfs.asseterp.biz.sys.dto;

import java.time.LocalDate;

/** AS-IS Sys95_ManualModel (sys95_manual.selectByText) — 매뉴얼 첨부 파일 한 건. publicYn은 A34(관리) 그리드의 공개 체크박스 */
public record ManualRes(
        Long manualId,
        LocalDate regDate,
        String manualType,
        String manualTypeNm,
        Long fileId,
        String fileNm,
        String fileExt,
        String publicYn,
        String note
) {
}
