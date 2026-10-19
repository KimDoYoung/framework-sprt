package kr.co.kfs.asseterp.biz.apr.dto;

import java.time.LocalDate;

/** apr03_relate_fund.selectByIcsClassTreeId 조건. companyId·orgId는 로그인 사용자, searchText는 LIKE 패턴 */
public record AprIcsDocListCond(Long classTreeId, Long companyId, Long orgId, LocalDate startDate, LocalDate endDate, String searchText) {
}
