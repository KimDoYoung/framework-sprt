package kr.co.kfs.asseterp.biz.bmt.dto;

import java.time.LocalDate;

/** Bmt20_Lookup_RelateAppr 그리드 한 행 — AS-IS bmt20_relate_appr.selectByInfoId */
public record BmtRelateApprRes(
        Long relateApprId,
        Long infoId,
        Long apprId,
        LocalDate regDate,
        String title
) {
}
