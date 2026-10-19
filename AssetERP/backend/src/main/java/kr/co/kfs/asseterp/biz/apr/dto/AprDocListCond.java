package kr.co.kfs.asseterp.biz.apr.dto;

import java.time.LocalDate;

/** apr01_appr.selectByClassTreeId2 조건. orgId·personId는 로그인 사용자, searchText는 LIKE 패턴 */
public record AprDocListCond(Long classTreeId, Long orgId, Long personId, LocalDate startDate, LocalDate endDate, String searchText) {
}
