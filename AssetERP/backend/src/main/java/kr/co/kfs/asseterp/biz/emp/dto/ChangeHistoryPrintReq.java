package kr.co.kfs.asseterp.biz.emp.dto;

import java.time.LocalDate;

/** 사원정보 변경조회 [출력/다운로드] 조건. 자격사항 탭은 startDate(기준일)·searchText만 쓴다(AS-IS insertRdEmp08History) */
public record ChangeHistoryPrintReq(LocalDate startDate, LocalDate closeDate, String searchText, String empTransCode) {
}
