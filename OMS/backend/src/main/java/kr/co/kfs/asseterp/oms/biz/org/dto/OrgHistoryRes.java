package kr.co.kfs.asseterp.oms.biz.org.dto;

import java.time.LocalDate;

/** 조직정보 이력 (AS-IS Org02_InfoModel, org02_info) */
public record OrgHistoryRes(
        Long infoId,
        Long codeId,
        Long parentCodeId,
        LocalDate modDate,
        String modReason,
        String korNm,
        String engNm,
        String levelCd,
        String levelNm,
        String sortOrder,
        String note
) {
}
