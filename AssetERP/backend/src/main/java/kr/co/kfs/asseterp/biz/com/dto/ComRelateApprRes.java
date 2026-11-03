package kr.co.kfs.asseterp.biz.com.dto;

import java.time.LocalDate;

/** com01_relate_appr.selectByKeyTableId — 증빙자료(연결된 상신문서) 한 행 (Com01_Lookup_RelateAppr 그리드, EE34) */
public record ComRelateApprRes(
        Long relateApprId,
        String keyTable,
        Long keyTableId,
        Long apprId,
        LocalDate regDate,
        LocalDate effectDate,
        String title,
        String regEmpName,
        String statusName
) {
}
