package kr.co.kfs.asseterp.biz.apr.dto;

import java.time.LocalDate;

/**
 * apr01_appr.selectByText2 조건 (F05 통합 문서검색). admin은 'true'/'false' 문자열(AS-IS LoginUser.getIsManager().toString()),
 * searchText·receiveName·aprStatusCode·aprInoutCode는 LIKE 패턴, typeCode는 분류 트리 범위('%' = 문서구분 포함)
 */
public record AprDocSearchCond(Long companyId, Long classTreeId, Long orgId, Long empId, String admin, LocalDate startDate, LocalDate endDate,
                               String searchText, String receiveName, String aprStatusCode, String aprInoutCode, String typeCode) {
}
