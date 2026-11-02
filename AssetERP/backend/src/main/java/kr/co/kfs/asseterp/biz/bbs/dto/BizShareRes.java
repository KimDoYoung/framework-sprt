package kr.co.kfs.asseterp.biz.bbs.dto;

import java.time.LocalDate;

/** 업무공유 그리드 행 (AS-IS Bbs10_BizShareModel, bbs10_biz_share.selectByText·selectById) */
public record BizShareRes(
        Long bizShareId,
        LocalDate date,
        String bizShareType,
        String bizShareTypeName,
        String content,
        String keyword,
        String note,
        Long personId,
        String personName
) {
}
