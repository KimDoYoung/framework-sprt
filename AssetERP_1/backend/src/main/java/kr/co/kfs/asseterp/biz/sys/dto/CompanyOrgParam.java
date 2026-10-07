package kr.co.kfs.asseterp.biz.sys.dto;

import java.time.LocalDate;

/** 회사 초기화 1단계: 조직 최상단 org01(코드 10000) + org02(회사명, 레벨 0010) */
public record CompanyOrgParam(Long companyId, Long orgCodeId, Long orgInfoId, String companyNm, LocalDate startDate) {
}
