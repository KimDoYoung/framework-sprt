package kr.co.kfs.asseterp.biz.biz.dto;

import java.time.LocalDate;

/** 이익제공 상세현황(Biz01_Tab_PriorApproval) 한 행 — 그리드 11열. 행 식별자 rowId는 SQL의 row_number() */
public record BizProvideListRes(Long rowId, LocalDate provideDate, String orgName, String regEmpName, String providePurName,
                                String provideContentName, String targetName, String targetCompanyName, String targetEmpName,
                                String targetOrgName, Long averagePrice, String note) {
}
