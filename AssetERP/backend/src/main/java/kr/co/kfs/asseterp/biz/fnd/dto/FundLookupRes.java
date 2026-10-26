package kr.co.kfs.asseterp.biz.fnd.dto;

import java.time.LocalDate;

/** 펀드찾기(Fnd00_Lookup_FundCode) 한 행 — AS-IS Fnd00_FundModel 중 그리드 열과 돌려줄 id */
public record FundLookupRes(Long fundId, String fundCode, String fundName, String fundTypeName, String orgCodeName,
                            LocalDate startDate, String closeName, String note) {
}
