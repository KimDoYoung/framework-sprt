package kr.co.kfs.asseterp.biz.tdm.dto;

/** 책무사용 기본설정 중 점검 처리가 읽는 값 (AS-IS tdm91_company_setup.selectByDate — 설정이 없으면 기본 행) */
public record CheckCompanySetup(Integer cmntMinLimit, Boolean evidFileCheckYn) {
}
