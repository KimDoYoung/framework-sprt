package kr.co.kfs.asseterp.biz.bbs.dto;

import java.time.LocalDate;

/** 업무공유 저장 — bizShareId가 없으면 새 글 (AS-IS Bbs10_BizShare.modelUpdate) */
public record BizShareSaveReq(
        Long bizShareId,
        LocalDate date,
        String bizShareType,
        String content,
        String keyword,
        String note
) {
}
