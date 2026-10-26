package kr.co.kfs.asseterp.biz.fnd.dto;

import java.time.LocalDate;

/** 펀드 조회(변경이력) 왼쪽 목록 한 행 (P08, AS-IS Fnd01_FundCodeModel — 펀드별 기준일 현재 최신 펀드정보) */
public record FundHistoryRes(Long fundCodeId, String fundCode, String fundName, LocalDate workDate, LocalDate startDate, LocalDate endDate) {
}
