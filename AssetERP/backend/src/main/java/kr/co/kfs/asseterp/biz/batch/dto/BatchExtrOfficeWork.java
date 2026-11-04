package kr.co.kfs.asseterp.biz.batch.dto;

/** 아직 맵핑되지 않은 타사무 사무수탁사 코드 (AS-IS ifi30_fund.selectOfficeWork) */
public record BatchExtrOfficeWork(String ifCode, String officeWorkCode, String officeWorkName, Long companyId) {
}
