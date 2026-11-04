package kr.co.kfs.asseterp.biz.apr.dto;

import java.time.LocalDate;

/** 미결재건 창 한 행 (AS-IS Apr01_ApprModel 중 regDate·title·regEmpName — Frm01_Lookup_Outstanding 그리드) */
public record AprOutstandingRes(
        Long apprId,
        LocalDate regDate,
        String title,
        String regEmpName
) {
}
