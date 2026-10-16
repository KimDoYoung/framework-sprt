package kr.co.kfs.asseterp.biz.org.dto;

import java.time.LocalDateTime;

/** 조직정보 이력 행 (AS-IS Org02_InfoModel, org02_info) */
public record OrgInfoHistRes(
        Long infoId,
        Long codeId,
        Long parentCodeId,
        String korNm,
        LocalDateTime modDate,
        String modReason,
        String levelCd,
        String levelNm,
        String sortOrder,
        String engNm,
        String note,
        String dcrIdWord
) {
}
