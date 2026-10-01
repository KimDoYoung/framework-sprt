package kr.co.kfs.asseterp.oms.biz.org.dto;

import java.time.LocalDate;

/** 조직 조회 조건. codeId는 단건(AS-IS selectByBaseDate) */
public record OrgCodeSearchParam(Long companyId, LocalDate baseDate, Long codeId) {
}
