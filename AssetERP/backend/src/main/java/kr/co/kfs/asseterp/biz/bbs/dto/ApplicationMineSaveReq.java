package kr.co.kfs.asseterp.biz.bbs.dto;

import java.time.LocalDate;

/** 기타신청서 작성 저장(임시저장·신청 전 저장) — applicationId가 없으면 새 신청서 (AS-IS Bbs11_Application.modelUpdate) */
public record ApplicationMineSaveReq(
        Long applicationId,
        LocalDate appDate,
        String appType,
        String note,
        String content
) {
}
