package kr.co.kfs.asseterp.oms.biz.sys.dto;

import java.time.LocalDate;

/**
 * 로그인내역 조회 조건 (AS-IS 파라미터 Map)
 *
 * @param companyId 회사 ID 문자열 LIKE ('%'면 전체)
 * @param loginMode 접속경로 코드 LIKE ('%'면 전체)
 */
public record LoginHistorySearchParam(LocalDate startDate, LocalDate closeDate, String companyId, String loginMode) {
}
