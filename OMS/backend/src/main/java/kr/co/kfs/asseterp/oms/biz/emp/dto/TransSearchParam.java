package kr.co.kfs.asseterp.oms.biz.emp.dto;

import java.time.LocalDate;

/** 사원 Lookup 검색 조건 (AS-IS Emp03_Trans.selectByText) */
public record TransSearchParam(Long companyId, String searchText, LocalDate transDate, boolean isSeparateAddTitle) {
}
