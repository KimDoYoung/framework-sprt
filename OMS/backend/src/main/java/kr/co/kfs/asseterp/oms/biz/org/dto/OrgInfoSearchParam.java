package kr.co.kfs.asseterp.oms.biz.org.dto;

import java.time.LocalDate;

/** 조직 검색 조건 (AS-IS Org00_OrgInfo.selectByKorName). korNm은 LIKE 패턴 */
public record OrgInfoSearchParam(Long companyId, LocalDate baseDate, String korNm) {
}
