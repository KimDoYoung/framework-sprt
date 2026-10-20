package kr.co.kfs.asseterp.biz.apr.dto;

import java.time.LocalDate;

/**
 * apr01_appr.selectApprListByEmpId 조건 (G01 결재내역 조회). status는 코드 또는 '%'(전체), aprYn은 'true'/'false'(완료/반려건 포함),
 * dateType은 'reg'(상신일)/'effect'(시행일), searchText는 LIKE 패턴, typeCode는 분류 트리 범위('%' = 문서구분 포함)
 */
public record AprMyApproveCond(Long companyId, Long empId, LocalDate startDate, LocalDate closeDate, String status, String aprYn,
                               String dateType, String searchText, Long classTreeId, String typeCode) {
}
