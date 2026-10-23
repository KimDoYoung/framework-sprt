package kr.co.kfs.asseterp.biz.biz.dto;

import java.time.LocalDate;

/** (s)이익제공 상세현황(Biz01_Tab_PriorApprovalSimple) 한 행 — 한도초과 내역. rowId = SQL의 row_number() */
public record BizProvideSimpleRes(Long rowId, String provideRcvTypeName, String regEmpName, LocalDate provideDate, String providePurName,
                                  String provideContentName, String provideCompany, Long pepleCount, Long averagePrice2, String note) {
}
