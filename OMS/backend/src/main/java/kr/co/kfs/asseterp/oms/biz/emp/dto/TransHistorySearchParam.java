package kr.co.kfs.asseterp.oms.biz.emp.dto;

import java.time.LocalDate;

/** 발령 변경 조회 조건 (AS-IS emp03_trans.selectByHistory). searchText는 LIKE 패턴 */
public record TransHistorySearchParam(Long companyId, LocalDate startDate, LocalDate closeDate, String searchText) {
}
