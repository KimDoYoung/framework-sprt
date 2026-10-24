package kr.co.kfs.asseterp.biz.tdm.dto;

/** 적용기간 저장 한 행 (AS-IS Tdm42_ManlOrg.update 가 바꾸는 컬럼: 적용시작일·적용종료일). 날짜는 yyyy-MM-dd, 비우면 null */
public record ManlOrgPeriodReq(Long manlOrgId, String startDate, String endDate) {
}
