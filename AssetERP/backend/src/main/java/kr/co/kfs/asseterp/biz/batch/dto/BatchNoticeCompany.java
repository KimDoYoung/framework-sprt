package kr.co.kfs.asseterp.biz.batch.dto;

/** 알림 대상 회사 (AS-IS sys01_company.selectByName(companyName=%, useYn=true) 중 위치명) */
public record BatchNoticeCompany(Long companyId, String locName) {
}
