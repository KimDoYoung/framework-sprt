package kr.co.kfs.asseterp.biz.fnd.dto;

import java.time.LocalDate;

/** 연관펀드 조회창(Fnd01_Lookup_SelectMulti) 한 행 — AS-IS Fnd00_FundModel 중 그리드 열과 돌려줄 id */
public record FundMultiRes(Long fundId, String fundCode, String fundName, String kofiaFundTypeName, String kofiaClassTypeName,
                           String consignmentName, LocalDate startDate, String empName1, String note) {
}
